import { LetStatement, Identifier } from '@/ast'
import { tokens } from '@/token'

describe('AST Nodes', () => {
  it('let statements can be serialised', () => {
    let serialised = new LetStatement(
      tokens.let,
      new Identifier(tokens.idt('x')),
      new Identifier(tokens.idt('y'))
    ).toString()

    expect(serialised).toEqual('let x = y;')
  })
})
