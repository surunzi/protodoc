import util from './util'

var exports = {};

const EOF = 'EndOfFile';

class Token
{
    constructor(tag, val)
    {
        return [tag, val];
    }
}

class Lexer
{
    constructor(input)
    {
        this.input  = input;
        this.length = input.length;
        this.i      = 0;
        this.c      = (input.length === 0 ?
                       EOF : input[0]);
    }

    tokenize()
    {
        this.tokens = [];

        var token;

        while(token = this.nextToken()) this.tokens.push(token);

        return this.tokens;
    }

    nextToken()
    {
        var c;

        while (this.c !== EOF)
        {
            c = this.c;

            if (Lexer.isEmpty(c))
            {
                this.consume();
                continue;
            }

            if (c === ':')
            {
                this.forward();
                return Lexer.createToken(c);
            }

            if (c === '-')
            {
                this.forward();
                return Lexer.createToken(c);
            }

            if (this.lastToken('-'))
            {
                return this.identifier('PARAM');
            }

            if (this.equal('name', [' ', ':']))
            {
                this.forward(4);
                return Lexer.createToken('NAME');
            }

            if (this.equal('method', [' ', ':']))
            {
                this.forward(4);
                return Lexer.createToken('METHOD');
            }

            if (this.equal('desc', [' ', ':']))
            {
                this.forward(4);
                return Lexer.createToken('DESC');
            }

            if (this.equal('url', [' ', ':']))
            {
                this.forward(3);
                return Lexer.createToken('URL');
            }

            if (this.equal('params', [' ', ':']))
            {
                this.forward(6);
                return Lexer.createToken('PARAMS');
            }

            if (this.equal('return', [' ', ':']))
            {
                this.forward(6);
                return Lexer.createToken('RETURN');
            }

            if (this.equal('string', ' '))
            {
                this.forward(6);
                return Lexer.createToken('TYPE', 'string');
            }

            if (this.equal('number', ' '))
            {
                this.forward(6);
                return Lexer.createToken('TYPE', 'number');
            }

            if (this.equal('object', ' '))
            {
                this.forward(6);
                return Lexer.createToken('TYPE', 'object');
            }

            if (this.equal('array', ' '))
            {
                this.forward(5);
                return Lexer.createToken('TYPE', 'array');
            }

            if (this.lastToken(':') || this.lastToken('TYPE'))
            {
                return this.value();
            }

            this.consume();
        }
    }

    value()
    {
        var val = '', lastC = '';

        while (!(this.equal('\n') && lastC !== '\\'))
        {
            if (this.c === '\n' && lastC === '\\')
            {
                val = val.substr(0, val.length - 1) + '\n';
            } else
            {
                val += this.c;
            }

            lastC = this.c;
            this.forward();
            if (this.c === EOF) break;
        }

        return Lexer.createToken('VALUE', val);
    }

    identifier(tagName)
    {
        var val = '';

        while (Lexer.isLetter(this.c))
        {
            val += this.c;
            this.forward();
        }

        return Lexer.createToken(tagName, val);
    }

    static isLetter(c)
    {
        var code = c.charCodeAt(0);

        return (code >= 65 && code <= 90) ||
               (code >= 97 && code <= 122);
    }

    lastToken(target)
    {
        var token = util.last(this.tokens);

        return token && token[0] === target;
    }

    static createToken(tag, val)
    {
        if (!val) val = tag;

        return new Token(tag, val);
    }

    equal(str, followChars)
    {
        return this.c === str[0] &&
               this.lookAhead(str.length - 1, str.substr(1), followChars);
    }

    lookAhead(len, target, followChars)
    {
        var ret = (this.input.substr(this.i + 1, len) === target);

        return ret && followChars ?
               Lexer.followFilter(this.input[this.i + 1 + len], followChars) : ret;
    }

    static followFilter(c, followChars)
    {
        if (util.isString(followChars)) followChars = [followChars];

        for (var i = 0, len = followChars.length; i < len; i++)
        {
            if (c === followChars[i]) return true;
        }

        return false;
    }

    consume(num)
    {
        num = num || 1;

        while (num--)
        {
            this.forward();
            this.whiteSpace();
        }
    }

    forward(num)
    {
        num = num || 1;

        while (num--)
        {
            this.i++;

            this.c = this.i >= this.length ?
                     EOF : this.input[this.i];
        }
    }

    whiteSpace()
    {
        while (Lexer.isEmpty(this.c)) this.forward();
    }

    static isEmpty(c)
    {
        return c === ' '  ||
               c === '\t' ||
               c === '\r' ||
               c === '\n';
    }
}

exports.Lexer = Lexer;

exports.lex = (input) =>
{
    var lexer = new Lexer(input);
    return lexer.tokenize();
};

export default exports