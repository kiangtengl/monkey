import { Identifier } from './ast'
import { Token, TokenType } from '@/token'
import { Program, Statement, LetStatement } from '@/ast'
import Lexer from '@/lexer'

export class Parser {
  private lexer: Lexer

  private currToken: Token | null = null
  private peekToken: Token | null = null

  private _errors: string[] = []

  public constructor(lexer: Lexer) {
    this.lexer = lexer

    this.nextToken()
    this.nextToken()
  }

  public parseProgram() {
    const program = new Program()

    while (this.currToken?.type !== TokenType.EOF) {
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
    switch (this.currToken?.type) {
      case TokenType.Let:
        return this.parseLetStatement()
      default:
        return null
    }
  }

  /**
   * Parses let (identifier) (=) ()
   */
  private parseLetStatement() {
    const letToken = this.currToken!

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
      expressionNode: () => {},
    })
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
