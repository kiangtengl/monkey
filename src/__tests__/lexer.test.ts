import Lexer from "@/lexer";
import { tokens } from "@/token";

describe("Lexer", () => {
  it("can handle empty input", () => {
    expect((new Lexer("")).nextToken()).toMatchObject(tokens.eof);
  });

  it("can handle nextToken after reaching the end", () => {
    const lexer = new Lexer("=");

    expect(lexer.nextToken()).toMatchObject(tokens.assgn);
    expect(lexer.nextToken()).toMatchObject(tokens.eof);
  })

  it("can recognise digits more than 1", () => {
    const lexer = new Lexer("10");

    expect(lexer.nextToken()).toMatchObject(tokens.int("10"));
  })

  it("returns an error if an illegal token is passed in", () => {
    const lexer = new Lexer("你");

    expect(lexer.nextToken()).toMatchObject(tokens.err("你"));
  })

  it("can recognise single character tokens", () => {
    const input = "=(){},;+-*/><!";

    const expected = [
      tokens.assgn,
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
      tokens.lt,
      tokens.bang,
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
      tokens.ret,
      tokens.eof
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
      tokens.assgn,
      tokens.int("5"),
      tokens.semi,
      tokens.let,
      tokens.idt("ten"),
      tokens.assgn,
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
      tokens.assgn,
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
      tokens.assgn,
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

  it("can tokenise boolean operators and if/else", () => {
    let input = `
        5 < 10 > 5;

        if (5 < 10) {
          return true;
        } else {
          return false;
        }
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

  it("can tokenise multi character tokens", () => {
    let input = `
      10 == 10;
      10 != 9;
    `;

    const expected = [
      tokens.int("10"),
      tokens.eq,
      tokens.int("10"),
      tokens.semi,
      tokens.int("10"),
      tokens.neq,
      tokens.int("9")
    ];

    const lexer = new Lexer(input);

    for (const token of expected) {
      expect(lexer.nextToken()).toMatchObject(token);
    }
  });
});
