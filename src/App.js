import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xDimension, yDimension, xIsNext, squares, onPlay }) {

  const winner = calculateWinner(squares, xDimension, yDimension);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X": "O");
  }

  function handleClick(i) {

    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();

    let symbol = "O"
    if (xIsNext) {
      symbol = "X"
    }

    nextSquares[i] = symbol;
    onPlay(nextSquares);
  }

  const boardRows = [...Array(yDimension)].map((_, j) => {
    const boardSquares = [...Array(xDimension)].map((_, i) => {
      const index = xDimension * j + i;
      return (
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
        />
      )
    });

    return (
      <div key={j} className="board-row">
        {boardSquares}
      </div>
    );

  })

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const xDimension = 10;
  const yDimension = 4;
  const [history, setHistory] = useState([Array(xDimension * yDimension).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    let description;
    if (move === currentMove) {
      description = 'You are at move #' + move;
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xDimension={xDimension} yDimension={yDimension} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, xDimension, yDimension) {

  let solutions = [];

  // Horizontal solutions
  for (let j = 0; j < yDimension; j++) {
    solutions.push([...Array(xDimension)].map((_, i) => {
      return [j * xDimension + i];
    }));
  }

  // Vertical solutions
  for (let i = 0; i < xDimension; i++) {
    solutions.push([...Array(yDimension)].map((_, j) => {
      return [j * xDimension + i];
    }));
  }

  // Diagonal solutions
  if (xDimension > yDimension) {
    // For \ shaped solutions
    for (let i = 0; i < xDimension; i++) {
      const solution = [...Array(yDimension)].map((_, j) => {
        let index = xDimension * j + i + j;
        if (index < xDimension * yDimension) {
          return [index];
        }
        return null;
      });
      if (!solution.includes(null)) {
        solutions.push(solution);
      }
    }
    // For / shaped solutions
    for (let i = 0; i < xDimension - yDimension + 1; i++) {
      const solution = [...Array(yDimension)].map((_, j) => {
        let index = xDimension * yDimension - 1 - (xDimension - 1) * (j + 1) + i;
        if (index < xDimension * yDimension) {
          return [index];
        }
        return null;
      });
      if (!solution.includes(null)) {
        solutions.push(solution);
      }
    }
  } else {
    // For \ shaped solutions
    for (let j = 0; j < yDimension; j++) {
      const solution = [...Array(xDimension)].map((_, i) => {
        let index = xDimension * j + i * (xDimension + 1);
        if (index < xDimension * yDimension) {
          return [index];
        }
        return null;
      });
      if (!solution.includes(null)) {
        solutions.push(solution);
      }
    }
    // For / shaped solutions
    for (let j = 0; j < yDimension; j++) {
      const solution = [...Array(xDimension)].map((_, i) => {
        let index = xDimension * i + xDimension - i - 1 + xDimension * j;
        if (index < xDimension * yDimension) {
          return [index];
        }
        return null;
      });
      if (!solution.includes(null)) {
        solutions.push(solution);
      }
    }
  }




  console.log(solutions);


  for (let i = 0; i < solutions.length; i++) {

    let values = [];

    solutions[i].forEach((index) => {
      values.push(squares[index]);
    });

    if (values.includes(null)) {
      continue;
    }

    const allEqual = values.every((value, _, arr) => value === arr[0]);

    if (allEqual) {
      console.log(values);
      console.log("All equal!");
      return values[0];
    }

  }
  return null;
}
