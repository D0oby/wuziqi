import { describe, expect, test } from "vitest";
import { chooseComputerMove, createEmptyBoard, getGameResult, placeStone } from "../src/game";

const at = (row: number, column: number) => row * 15 + column;
const rowOf = (index: number) => Math.floor(index / 15);
const columnOf = (index: number) => index % 15;

describe("自由规则五子棋", () => {
  test("横向五颗连续同色棋子会胜利", () => {
    let board = createEmptyBoard();

    for (let column = 3; column < 8; column += 1) {
      board = placeStone(board, at(7, column), "black");
    }

    expect(getGameResult(board)).toEqual({ kind: "victory", winner: "black" });
  });

  test("纵向五颗连续同色棋子会胜利", () => {
    let board = createEmptyBoard();

    for (let row = 2; row < 7; row += 1) {
      board = placeStone(board, at(row, 9), "black");
    }

    expect(getGameResult(board)).toEqual({ kind: "victory", winner: "black" });
  });

  test("两个斜向的五颗连续同色棋子都会胜利", () => {
    let descending = createEmptyBoard();
    let ascending = createEmptyBoard();

    for (let offset = 0; offset < 5; offset += 1) {
      descending = placeStone(descending, at(3 + offset, 4 + offset), "black");
      ascending = placeStone(ascending, at(9 - offset, 4 + offset), "black");
    }

    expect(getGameResult(descending)).toEqual({ kind: "victory", winner: "black" });
    expect(getGameResult(ascending)).toEqual({ kind: "victory", winner: "black" });
  });

  test("五颗以上连续同色棋子也会胜利", () => {
    let board = createEmptyBoard();

    for (let column = 2; column < 8; column += 1) {
      board = placeStone(board, at(10, column), "black");
    }

    expect(getGameResult(board)).toEqual({ kind: "victory", winner: "black" });
  });

  test("棋盘下满且无人胜利时为平局", () => {
    let board = createEmptyBoard();
    const rows = ["BBBBWWWWBBBBWWW", "WWWWBBBBWWWWBBB"];

    for (let row = 0; row < 15; row += 1) {
      for (let column = 0; column < 15; column += 1) {
        const stone = rows[row % 2][column] === "B" ? "black" : "white";
        board = placeStone(board, at(row, column), stone);
      }
    }

    expect(getGameResult(board)).toEqual({ kind: "draw" });
  });
});

describe("电脑玩家", () => {
  test("存在一步胜利落点时会选择该落点", () => {
    let board = createEmptyBoard();

    for (let column = 3; column < 7; column += 1) {
      board = placeStone(board, at(7, column), "white");
    }

    expect([at(7, 2), at(7, 7)]).toContain(chooseComputerMove(board));
  });

  test("人类玩家存在下一步直接胜利点时会封堵", () => {
    let board = createEmptyBoard();

    for (let column = 3; column < 7; column += 1) {
      board = placeStone(board, at(2, column), "black");
    }

    expect([at(2, 2), at(2, 7)]).toContain(chooseComputerMove(board));
  });

  test("没有直接胜负时会选择靠近已有棋子的落点", () => {
    const board = placeStone(createEmptyBoard(), at(2, 2), "black");

    const move = chooseComputerMove(board);

    expect(move).not.toBeNull();
    expect(Math.abs(rowOf(move!) - 2)).toBeLessThanOrEqual(1);
    expect(Math.abs(columnOf(move!) - 2)).toBeLessThanOrEqual(1);
  });
});
