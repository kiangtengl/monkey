/**
 * Precedence for evaluating expressions
 */
enum Precedence {
  _, // dummy value, takes 0
  LOWEST,
  EQUALS, // ==
  LESSGREATER, // > or <
  SUM, // +
  PRODUCT, // *
  PREFIX, // -X or !X
  CALL, // f(x)
}

export default Precedence
