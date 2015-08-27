import AstBuilder from './AstBuilder'
import AstWalker  from './AstWalker'

export class Parser
{
    constructor(input)
    {
        this.input = input;
    }

    parse()
    {
        return this.input;
    }
}

export function parse(input)
{
    var parser = new Parser(input);
    return parser.parse();
}