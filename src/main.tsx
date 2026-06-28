import React from "react";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BOARD_SIZE, type Board, chooseComputerMove, createEmptyBoard, getGameResult, placeStone } from "./game";
import "./styles.css";

type TurnPhase = "human" | "computer-thinking";
const COMPUTER_DELAY_MS = 350;

function App() {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [turnPhase, setTurnPhase] = useState<TurnPhase>("human");
  const gameResult = getGameResult(board);
  const statusText = getStatusText(gameResult, turnPhase);

  useEffect(() => {
    if (turnPhase !== "computer-thinking" || gameResult.kind !== "playing") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setBoard((currentBoard) => {
        const computerMove = chooseComputerMove(currentBoard);
        return computerMove === null ? currentBoard : placeStone(currentBoard, computerMove, "white");
      });
      setTurnPhase("human");
    }, COMPUTER_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [gameResult.kind, turnPhase]);

  const placeHumanStone = (index: number) => {
    if (turnPhase !== "human" || gameResult.kind !== "playing" || board[index]) {
      return;
    }

    const nextBoard = placeStone(board, index, "black");
    setBoard(nextBoard);

    if (getGameResult(nextBoard).kind === "playing") {
      setTurnPhase("computer-thinking");
    }
  };

  const restartGame = () => {
    setBoard(createEmptyBoard());
    setTurnPhase("human");
  };

  const intersections = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
    const row = Math.floor(index / BOARD_SIZE) + 1;
    const column = (index % BOARD_SIZE) + 1;
    const stone = board[index];
    const label = stone ? `第 ${row} 行第 ${column} 列，${stone === "black" ? "黑棋" : "白棋"}` : `第 ${row} 行第 ${column} 列`;

    return (
      <button
        aria-label={label}
        className="intersection"
        key={`${row}-${column}`}
        onClick={() => placeHumanStone(index)}
        role="gridcell"
        type="button"
      >
        {stone ? <span className={`stone ${stone === "black" ? "black-stone" : "white-stone"}`} /> : null}
      </button>
    );
  });

  return (
    <main className="page-shell">
      <section className="game-panel" aria-label="人机对战五子棋">
        <div aria-label="棋盘" className="board" role="grid">
          {intersections}
        </div>
        <aside aria-label="棋局状态" className="status-panel">
          <p role="status">{statusText}</p>
          <button className="restart-button" onClick={restartGame} type="button">
            重新开始
          </button>
        </aside>
      </section>
    </main>
  );
}

function getStatusText(result: ReturnType<typeof getGameResult>, turnPhase: TurnPhase) {
  if (result.kind === "victory") {
    return result.winner === "black" ? "你赢了" : "电脑玩家胜利";
  }

  if (result.kind === "draw") {
    return "平局";
  }

  return turnPhase === "computer-thinking" ? "电脑玩家思考中" : "轮到你落子";
}


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
