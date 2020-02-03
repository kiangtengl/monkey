import {
  LetStatement,
  Statement,
  ReturnStatement,
  ExpressionStatement,
  Identifier,
  IntegerLiteral,
  Expression,
  PrefixExpression,
} from './../ast'
import Lexer from '@/lexer'
import { Parser } from '@/parser'

function testLetStatement(statement: Statement, name: string) {
  if (statement instanceof LetStatement) {
    expect(statement.tokenLiteral()).toEqual('let')
    expect(statement.name.value).toBe(name)
    expect(statement.name.tokenLiteral()).toBe(name)
  } else {
    throw new Error('Statement should have a let statement')
  }
}

function checkParserErrors(parser: Parser) {
  if (parser.errors.length > 0) {
    throw new Error(`
Errors while parsing:
${parser.errors.join('\n')}
    `)
  }
}

function testIntegerLiteral(expr: Expression, expected: number) {
  expect(expr).toBeInstanceOf(IntegerLiteral)
  if (!(expr instanceof IntegerLiteral)) {
    return
  }

  expect(expr.value).toBe(expected)
  expect(expr.tokenLiteral()).toBe(expected.toString())
}

describe('Parser', () => {
  it('Can parse an empty program', () => {
    const input = ``

    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const program = parser.parseProgram()

    checkParserErrors(parser)

    expect(program.statements.length).toBe(0)
    expect(program.tokenLiteral()).toBe('')
  })

  it('Can detect errors', () => {
    const input = `
      let 5;
      let x 5;
    `

    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    parser.parseProgram()

    expect(() => checkParserErrors(parser)).toThrow()
    expect(parser.errors.length).toBe(2)
  })

  it('Can parse let statements', () => {
    const input = `
      let x = 5;
      let y = 10;
      let foobar = 838383;
    `

    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const program = parser.parseProgram()

    checkParserErrors(parser)

    expect(program.statements.length).toBe(3)
    expect(program.tokenLiteral()).toBe('let')

    const expectedIdentifiers = ['x', 'y', 'foobar']

    expectedIdentifiers.forEach((identifier, i) => {
      testLetStatement(program.statements[i], identifier)
    })
  })

  it('Can parse return statements', () => {
    const input = `
      return 5;
      return 10;
      return 93322;
    `

    const lexer = new Lexer(input)
    const parser = new Parser(lexer)
    const program = parser.parseProgram()

    checkParserErrors(parser)

    expect(program.statements.length).toBe(3)

    program.statements.forEach(statement => {
      if (statement instanceof ReturnStatement) {
        expect(statement.tokenLiteral()).toBe('return')
      }
    })
  })

  describe('Expressions Statements', () => {
    it('Can parse identifiers', () => {
      const input = 'foo;'

      const lexer = new Lexer(input)
      const parser = new Parser(lexer)
      const program = parser.parseProgram()

      checkParserErrors(parser)

      expect(program.statements.length).toBe(1)

      const [expressionStatement] = program.statements

      expect(expressionStatement).toBeInstanceOf(ExpressionStatement)
      if (!(expressionStatement instanceof ExpressionStatement)) {
        return
      }

      const expr = expressionStatement.expression
      expect(expr).toBeInstanceOf(Identifier)
      if (!(expr instanceof Identifier)) {
        return
      }

      expect(expr.value).toEqual('foo')
      expect(expr.tokenLiteral()).toEqual('foo')
    })

    it('Can parse integers', () => {
      const input = '5;'

      const lexer = new Lexer(input)
      const parser = new Parser(lexer)
      const program = parser.parseProgram()

      checkParserErrors(parser)

      expect(program.statements.length).toBe(1)

      const [expressionStatement] = program.statements

      expect(expressionStatement).toBeInstanceOf(ExpressionStatement)
      if (!(expressionStatement instanceof ExpressionStatement)) {
        return
      }

      const expr = expressionStatement.expression
      expect(expr).toBeInstanceOf(IntegerLiteral)
      if (!(expr instanceof IntegerLiteral)) {
        return
      }

      expect(expr.value).toEqual(5)
      expect(expr.tokenLiteral()).toEqual('5')
    })

    it('Can parse prefix expressions', () => {
      const testCases = [
        { input: '!5;', operator: '!', expectedValue: 5 },
        { input: '-15;', operator: '-', expectedValue: 15 },
      ]

      testCases.forEach(({ input, operator, expectedValue }) => {
        const lexer = new Lexer(input)
        const parser = new Parser(lexer)
        const program = parser.parseProgram()
        checkParserErrors(parser)

        expect(program.statements.length).toBe(1)
        const [expressionStatement] = program.statements

        expect(expressionStatement).toBeInstanceOf(ExpressionStatement)
        if (!(expressionStatement instanceof ExpressionStatement)) {
          return
        }

        const expr = expressionStatement.expression
        expect(expr).toBeInstanceOf(PrefixExpression)
        if (!(expr instanceof PrefixExpression)) {
          return
        }

        expect(expr.operator).toEqual(operator)
        testIntegerLiteral(expr.right, expectedValue)
      })
    })
  })
})
