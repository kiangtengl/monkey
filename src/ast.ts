import { Token } from '@/token'
export interface Node {
  tokenLiteral(): string
}

export interface Statement extends Node {
  statementNode: () => void
}

export interface Expression extends Node {
  expressionNode: () => void
}

export class Program implements Node {
  public statements: Statement[] = []

  public tokenLiteral(): string {
    return this.statements.length > 0 ? this.statements[0].tokenLiteral() : ''
  }
}

export class Identifier implements Expression {
  public token: Token
  public value: string

  public constructor(token: Token) {
    this.token = token
    this.value = token.literal
  }

  public expressionNode() {}

  public tokenLiteral() {
    return this.token.literal
  }
}

export class LetStatement implements Statement {
  public token: Token
  public name: Identifier
  public value: Expression

  public constructor(
    letToken: Token,
    nameToken: Identifier,
    valueToken: Expression
  ) {
    this.token = letToken
    this.name = nameToken
    this.value = valueToken
  }

  public statementNode() {}

  public tokenLiteral() {
    return this.token.literal
  }
}
