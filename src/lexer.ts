import { getIdentifier, Token, tokens } from "./token";

function isLetter(c: string | null) {
  if (c === null) {
    return false;
  }

  let n = c.charCodeAt(0);
  return (n >= 65 && n < 91) || (n >= 97 && n < 123);
}

function isDigit(c: string | null) {
  if (c === null) {
    return false;
  }

  let n = c.charCodeAt(0);
  return 48 <= n && n <= 57;
}

export default class Lexer {
  private input: string;

  // current position in input (points to current char)
  private position = 0;

  // current reading position in input (after current char)
  private toRead = 0;

  private char: string | null = null;

  constructor(input: string) {
    this.input = input;
    this.readChar();
  }

  public nextToken(): Token {
    let token = tokens.eof;

    this.skipWhitespace();

    switch (this.char) {
      case "=":
        /* == */
        if (this.peekChar() == "=") {
          token = tokens.eq;
          this.readChar();
        } else {
          token = tokens.assgn;
        }
        break;
      case "!":
        /* != */
        if (this.peekChar() == "=") {
          token = tokens.neq;
          this.readChar();
        } else {
          token = tokens.bang;
        }
        break;
      case ">":
        token = tokens.gt;
        break;
      case "<":
        token = tokens.lt;
        break;
      /* Operators */
      case "+":
        token = tokens.plus;
        break;
      case "*":
        token = tokens.mult;
        break;
      case "-":
        token = tokens.minus;
        break;
      case "/":
        token = tokens.div;
        break;
      case "(":
        token = tokens.lp;
        break;
      case ")":
        token = tokens.rp;
        break;
      case "{":
        token = tokens.lb;
        break;
      case "}":
        token = tokens.rb;
        break;
      case ",":
        token = tokens.cm;
        break;
      case ";":
        token = tokens.semi;
        break;
      case null:
        break;
      default:
        if (isLetter(this.char)) {
          let literal = this.readIdentifier();
          return {
            type: getIdentifier(literal),
            literal
          };
        } else if (isDigit(this.char)) {
          return tokens.int(this.readNumber());
        } else {
          token = tokens.err(this.char);
        }
    }

    this.readChar();
    return token;
  }

  private readChar() {
    this.char =
      this.toRead >= this.input.length ? null : this.input[this.toRead];

    this.position = this.toRead;
    this.toRead += 1;
  }

  private readIdentifier() {
    let start = this.position;
    while (isLetter(this.char)) {
      this.readChar();
    }
    let end = this.position;

    return this.input.slice(start, end);
  }

  private readNumber() {
    let start = this.position;
    while (isDigit(this.char)) {
      this.readChar();
    }
    let end = this.position;

    return this.input.slice(start, end);
  }

  private peekChar() {
    return this.toRead >= this.input.length ? null : this.input[this.toRead];
  }

  private skipWhitespace() {
    while (
      this.char == " " ||
      this.char == "\t" ||
      this.char == "\n" ||
      this.char == "\r"
    ) {
      this.readChar();
    }
  }
}
