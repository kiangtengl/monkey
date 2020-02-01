export enum TokenType {
  Illegal = "Illegal",
  EOF = "EOF",

  Identifier = "Identifier",
  Integer = "Integer",

  Assignment = "=",
  Plus = "+",
  Minus = "-",
  Divide = "/",
  Multiply = "*",

  Bang = "!",
  LessThan = "<",
  GreaterThan = ">",

  Comma = ",",
  Semicolon = ";",

  LeftParenthesis = "(",
  RightParenthesis = ")",
  LeftBrace = "{",
  RightBrace = "}",

  Function = "function",
  Let = "Let",
  True = "true",
  False = "false",
  If = "if",
  Else = "else",
  Return = "return"
}

export type Token = {
  type: TokenType;
  literal: string;
};

export const tokens = {
  let: { type: TokenType.Let, literal: "let" },
  cm: { type: TokenType.Comma, literal: "," },
  semi: { type: TokenType.Semicolon, literal: ";" },

  lp: { type: TokenType.LeftParenthesis, literal: "(" },
  rp: { type: TokenType.RightParenthesis, literal: ")" },

  lb: { type: TokenType.LeftBrace, literal: "{" },
  rb: { type: TokenType.RightBrace, literal: "}" },

  fn: { type: TokenType.Function, literal: "fn" },
  eof: { type: TokenType.EOF, literal: "" },

  plus: { type: TokenType.Plus, literal: "+" },
  minus: { type: TokenType.Minus, literal: "-" },
  div: { type: TokenType.Divide, literal: "/" },
  mult: { type: TokenType.Multiply, literal: "*" },
  eq: { type: TokenType.Assignment, literal: "=" },

  lt: { type: TokenType.LessThan, literal: "<" },
  gt: { type: TokenType.GreaterThan, literal: ">" },
  bang: { type: TokenType.Bang, literal: "!" },

  tru: { type: TokenType.True, literal: "true" },
  flse: { type: TokenType.False, literal: "false" },
  iff: { type: TokenType.If, literal: "if" },
  els: { type: TokenType.Else, literal: "else" },
  ret: { type: TokenType.Return, literal: "return" },

  idt: (literal: string) => ({
    type: TokenType.Identifier,
    literal
  }),
  int: (literal: string) => ({
    type: TokenType.Integer,
    literal
  }),
  err: (literal: string) => ({
    type: TokenType.Illegal,
    literal
  })
};

let keywords: { [k: string]: TokenType } = {
  fn: TokenType.Function,
  let: TokenType.Let,
  true: TokenType.True,
  false: TokenType.False,
  if: TokenType.If,
  else: TokenType.Else,
  return: TokenType.Return
};

export function getIdentifier(literal: string) {
  return keywords[literal] ?? TokenType.Identifier;
}
