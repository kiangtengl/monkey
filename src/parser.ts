import { Token, TokenType } from '@/token'
import {
  Program,
  Statement,
  LetStatement,
  Identifier,
  ReturnStatement,
  Expression,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
} from '@/ast'
import Lexer from '@/lexer'
import Precedence from './precedence'

type PrefixParser = (token: Token) => Expression | null
type InfixParser = (expression: Expression) => Expression | null

export class Parser {
  private lexer: Lexer

  private currToken: Token | null = null
  private peekToken: Token | null = null

  private _errors: string[] = []

  private prefixParsers: Partial<Record<TokenType, PrefixParser>> = {
    [TokenType.Identifier]: token => new Identifier(token),
    [TokenType.Integer]: token => {
      const value = parseInt(token.literal, 10)

      return Number.isNaN(value) ? null : new IntegerLiteral(token, value)
    },
    [TokenType.Bang]: this.parsePrefixExpression.bind(this),
    [TokenType.Minus]: this.parsePrefixExpression.bind(this),
  }
  private infixParsers: Partial<Record<TokenType, InfixParser>> = {}

  public constructor(lexer: Lexer) {
    this.lexer = lexer

    this.nextToken()
    this.nextToken()
  }

  public parseProgram() {
    const program = new Program()

    while (!this.currTokenIs(TokenType.EOF)) {
      const statement = this.parseStatement()

      statement !== null && program.statements.push(statement)

      this.nextToken()
    }

    return program
  }

  public get errors() {
    return this._errors
  }

  private parseStatement(): Statement | null {
    const token = this.currToken

    if (!token) {
      return null
    }

    switch (token.type) {
      case TokenType.Let:
        return this.parseLetStatement(token)
      case TokenType.Return:
        return this.parseReturnStatement(token)
      default:
        return this.parseExpressionStatement(token)
    }
  }

  /**
   * Parses let (identifier) (=) ()
   */
  private parseLetStatement(letToken: Token) {
    // (identifier)
    if (!this.tryAdvancePeekToTokenOfType(TokenType.Identifier)) {
      return null
    }

    const name = new Identifier(this.currToken!)

    // (=)
    if (!this.peekTokenIs(TokenType.Assignment)) {
      this.emitInvalidPeekToken(TokenType.Assignment)
      return null
    }

    while (!this.currTokenIs(TokenType.Semicolon)) {
      this.nextToken()
    }

    return new LetStatement(letToken, name, {
      tokenLiteral: () => '',
      expressionNode() {},
    })
  }

  /**
   * Parses return (expression)
   */
  private parseReturnStatement(returnToken: Token) {
    this.nextToken()

    while (!this.currTokenIs(TokenType.Semicolon)) {
      this.nextToken()
    }

    return new ReturnStatement(returnToken, {
      tokenLiteral: () => '',
      expressionNode() {},
    })
  }

  private parseExpressionStatement(token: Token) {
    const expr = this.parseExpression(Precedence.LOWEST)

    if (this.peekTokenIs(TokenType.Semicolon)) {
      this.nextToken()
    }

    return expr ? new ExpressionStatement(token, expr) : null
  }

  private parseExpression(precedence: Precedence): Expression | null {
    if (!this.currToken) {
      return null
    }

    const prefixParser = this.prefixParsers[
      this.currToken.type ?? TokenType.Illegal
    ]

    if (!prefixParser) {
      this.errors.push(
        `No prefix parse function found for ${this.currToken.type}`
      )

      return null
    }

    return prefixParser(this.currToken) ?? null
  }

  private parsePrefixExpression(operator: Token) {
    this.nextToken()
    return new PrefixExpression(
      operator,
      this.parseExpression(Precedence.PREFIX)!
    )
  }

  private nextToken() {
    this.currToken = this.peekToken
    this.peekToken = this.lexer.nextToken()
  }

  private currTokenIs(tokenType: TokenType) {
    return this.currToken?.type === tokenType
  }

  private peekTokenIs(tokenType: TokenType) {
    return this.peekToken?.type === tokenType
  }

  private tryAdvancePeekToTokenOfType(tokenType: TokenType) {
    if (this.peekTokenIs(TokenType.Identifier)) {
      this.nextToken()
      return true
    } else {
      this.emitInvalidPeekToken(tokenType)
      return false
    }
  }

  private emitInvalidPeekToken(expectedTokenType: TokenType) {
    this._errors.push(
      `Expected next token to be ${expectedTokenType} but got ${this.peekToken?.type}`
    )
  }
}
