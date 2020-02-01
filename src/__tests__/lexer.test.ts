import Lexer from "@/lexer";
import { tokens } from "@/token";

describe("Lexer", () => {
  it("can recognise single character tokens", () => {
    const input = "=(){},;+-*/><!";

    const expected = [
      tokens.eq,
      tokens.lp,
      tokens.rp,
      tokens.lb,
      tokens.rb,
      tokens.cm,
      tokens.semi,
      tokens.plus,
      tokens.minus,
      tokens.mult,
      tokens.div,
      tokens.gt,
      tokens.lt
    ];

    const lexer = new Lexer(input);

    for (const token of expected) {
      expect(lexer.nextToken()).toMatchObject(token);
    }
  });

  it("can recognise keywords", () => {
    const input = `
      true
      false
      fn
      let
      if
      else
      return
    `;

    const expected = [
      tokens.tru,
      tokens.flse,
      tokens.fn,
      tokens.let,
      tokens.iff,
      tokens.els,
      tokens.ret
    ];

    const lexer = new Lexer(input);

    for (const token of expected) {
      expect(lexer.nextToken()).toMatchObject(token);
    }
  });

  it("can tokenise let expressions", () => {
    let input = `
    let five = 5;
    let ten = 10;
    `;

    const expected = [
      tokens.let,
      tokens.idt("five"),
      tokens.eq,
      tokens.int("5"),
      tokens.semi,
      tokens.let,
      tokens.idt("ten"),
      tokens.eq,
      tokens.int("10"),
      tokens.semi
    ];

    const lexer = new Lexer(input);

    for (const token of expected) {
      expect(lexer.nextToken()).toMatchObject(token);
    }
  });

  it("can tokenise functions", () => {
    let input = `
    let add = fn(x, y) {
      x + y;
    };
    `;

    const expected = [
      tokens.let,
      tokens.idt("add"),
      tokens.eq,
      tokens.fn,
      tokens.lp,
      tokens.idt("x"),
      tokens.cm,
      tokens.idt("y"),
      tokens.rp,
      tokens.lb,
      tokens.idt("x"),
      tokens.plus,
      tokens.idt("y"),
      tokens.semi,
      tokens.rb,
      tokens.semi
    ];

    const lexer = new Lexer(input);

    for (const token of expected) {
      expect(lexer.nextToken()).toMatchObject(token);
    }
  });

  it("can tokenise function evaluations", () => {
    let input = `
      let result = add(five, ten);
    `;

    const expected = [
      tokens.let,
      tokens.idt("result"),
      tokens.eq,
      tokens.idt("add"),
      tokens.lp,
      tokens.idt("five"),
      tokens.cm,
      tokens.idt("ten"),
      tokens.rp,
      tokens.semi
    ];

    const lexer = new Lexer(input);

    for (const token of expected) {
      expect(lexer.nextToken()).toMatchObject(token);
    }
  });

  it("can tokenise boolean operators", () => {
    let input = `
        5 < 10 > 5;

        if (5 < 10) {
          return true;
        } else {
          return false;
        }

        10 == 10;
        10 != 9;
      `;

    const expected = [
      tokens.int("5"),
      tokens.lt,
      tokens.int("10"),
      tokens.gt,
      tokens.int("5"),
      tokens.semi,
      tokens.iff,
      tokens.lp,
      tokens.int("5"),
      tokens.lt,
      tokens.int("10"),
      tokens.rp,
      tokens.lb,
      tokens.ret,
      tokens.tru,
      tokens.semi,
      tokens.rb,
      tokens.els,
      tokens.lb,
      tokens.ret,
      tokens.flse,
      tokens.semi,
      tokens.rb
    ];

    const lexer = new Lexer(input);

    for (const token of expected) {
      expect(lexer.nextToken()).toMatchObject(token);
    }
  });
});
