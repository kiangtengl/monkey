import { TokenType } from '@/token'
import Lexer from '@/lexer'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('> ', input => {
  const lexer = new Lexer(input)

  for (
    let token = lexer.nextToken();
    token.type != TokenType.EOF;
    token = lexer.nextToken()
  ) {
    console.log(token)
  }
})
