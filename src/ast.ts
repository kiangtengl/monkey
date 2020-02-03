import { Token } from '@/token'
export interface Node {
  tokenLiteral(): string
  toString(): string
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

  public toString(): string {
    return this.statements.map(s => s.toString()).join('\n')
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

  public toString() {
    return this.value
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

  public toString() {
    return `let ${this.name} = ${this.value};`
  }
}

export class ReturnStatement implements Statement {
  public token: Token
  public returnValue: Expression

  public constructor(returnToken: Token, returnedValueToken: Expression) {
    this.token = returnToken
    this.returnValue = returnedValueToken
  }

  public statementNode() {}

  public tokenLiteral() {
    return this.token.literal
  }

  public toString() {
    return `return ${this.returnValue};`
  }
}

export class ExpressionStatement implements Statement {
  public token: Token
  public expression: Expression

  public constructor(token: Token, expression: Expression) {
    this.token = token
    this.expression = expression
  }

  public statementNode() {}

  public tokenLiteral() {
    return this.token.literal
  }

  public toString() {
    return this.expression.toString()
  }
}

export class IntegerLiteral implements Expression {
  public token: Token
  public value: number

  public constructor(token: Token, value: number) {
    this.token = token
    this.value = value
  }

  public expressionNode() {}

  public tokenLiteral() {
    return this.token.literal
  }

  public toString() {
    return this.token.literal
  }
}

export class PrefixExpression implements Expression {
  public token: Token
  public operator: string
  public right: Expression

  public constructor(operator: Token, right: Expression) {
    this.token = operator
    this.operator = operator.literal
    this.right = right
  }

  public expressionNode() {}

  public tokenLiteral() {
    return this.token.literal
  }

  public toString() {
    return `(${this.operator}${this.right})`
  }
}
