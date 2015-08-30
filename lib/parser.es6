import fs     from 'fs'
import lexer  from 'lexer'
import util   from './util'
import marked from 'marked'

var exports = {};

class Parser
{
    constructor(input)
    {
        this.tokens  = lexer.lex(input);
        this.input   = input;
        this.i       = 0;
        this.ast     = {};
        this.isEnded = false;

        this.nextToken();
    }

    parse()
    {
        try {
            this.body();
        } catch (e)
        {
            this.ast = {};
            console.log(this.input + '\n' + e.message);
        }

        return this.ast;
    }

    body()
    {
        while (!this.isEnded)
        {
            if (this.accept('NAME'))
            {
                this.name();
                continue;
            } else if (this.accept('METHOD'))
            {
                this.method();
                continue;
            }else if (this.accept('URL'))
            {
                this.url();
                continue;
            } else if (this.accept('DESC'))
            {
                this.desc();
                continue;
            } else if (this.accept('PARAMS'))
            {
                this.params();
                continue;
            } else if (this.accept('RETURN'))
            {
                this.ret();
                continue;
            }

            this.nextToken();
        }
    }

    name()
    {
        this.expect(':');
        this.ast.name = this.expect('VALUE');
    }

    method()
    {
        this.expect(':');
        this.ast.method = this.expect('VALUE');
    }

    url()
    {
        this.expect(':');
        this.ast.url = this.expect('VALUE');
    }

    desc()
    {
        this.expect(':');
        this.ast.desc = marked(this.expect('VALUE'));
    }

    params()
    {
        this.expect(':');
        this.ast.params = this.block(1);
    }

    ret()
    {
        this.expect(':');
        this.ast.ret = this.block(1);
    }

    block(level)
    {
        var indentNum, ast = {}, lastParam, param;

        while (this.accept('-'))
        {
            indentNum = 1;
            while (this.accept('-')) indentNum++;

            if (indentNum < level)
            {
                this.prevToken(indentNum);
                return ast;
            } else if (indentNum > level)
            {
                this.prevToken(indentNum);
                ast[lastParam]['children'] = this.block(indentNum);
            } else {
                lastParam = this.expect('PARAM');
                this.expect(':');
                param = {};
                param.type  = this.expect('TYPE');
                param.value = this.expect('VALUE');
                ast[lastParam] = param;
            }
        }

        return ast;
    }

    accept(tag)
    {
        if (!this.isEnded && tag === this.token[0])
        {
            this.value = this.token[1];
            this.nextToken();
            return true;
        }

        return false;
    }

    expect(tag)
    {
        if (this.accept(tag)) return this.value;

        throw new Error('Unexpected token: ' + this.token.join(', '));
    }

    nextToken(num)
    {
        num = num || 1;

        while (num--)
        {
            if (this.i >= this.tokens.length)
            {
                this.isEnded = true;
                break;
            }
            this.token = this.tokens[this.i++];
        }
    }

    prevToken(num)
    {
        num = num || 1;

        while (num--) this.token = this.tokens[--this.i];
    }
}

exports.Parser = Parser;

exports.parse = (srcFiles) =>
{
    var nodes = [];

    util.each(srcFiles, function (fileName)
    {
        var src = fs.readFileSync(fileName, env.conf.encoding);

        util.each(getProtoBlock(src), function (block)
        {
            var parser = new Parser(block);

            nodes.push(parser.parse());
        });
    });

    return nodes.sort((a, b) => a.name > b.name);
};

var regProtoDoc = /^protocol[^\n]*\n/;

function getProtoBlock(src)
{
    var comments = util.extractBlockComment(src);

    comments = util.map(comments, (comment) =>
    {
        comment = comment.replace(/^\/\*+|\*+\/$/mg, '')
                         .replace(/\n\s*\*+\s*/mg, '\n')
                         .replace(/\r/mg, '');

        return util.trimBlank(comment);
    });

    comments = util.filter(comments, (comment) => regProtoDoc.test(comment));

    return util.map(comments, (comment) => comment.replace(regProtoDoc, ''));
}

export default exports