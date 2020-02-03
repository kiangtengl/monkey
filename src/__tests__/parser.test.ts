import { LetStatement, Statement } from './../ast'
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
    const program = parser.parseProgram()

    expect(program.statements.length).toBe(0)
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
})
