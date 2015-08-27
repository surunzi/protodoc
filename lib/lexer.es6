export class Lexer
{
    constructor(input)
    {
        this.input = input;
    }

    tokenize()
    {
        return this.input;
    }
}

export function lex(input)
{
    var lexer = new Lexer(input);
    return lexer.tokenize();
}