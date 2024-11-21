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
  const xDimension = 4;
  const yDimension = 10;
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


  function gridCoordinatesToSquareIndex(i, j) {
    return i + j * xDimension
  }

  function indexInBounds(index) {
    if (index < 0 || index > xDimension * yDimension) {
      return false;
    }
    return true;
  }

  function solutionValid(solution) {
    for (let index = 0; index < solution.length; index++) {
      if (!indexInBounds(solution[index])) {
        return false;
      }
    }
    return true;
  }

  let possible_solutions = [];

  for (let x = 0; x < xDimension; x++) {
    for (let y = 0; y < yDimension; y++) {

      if (x === 0) {
        possible_solutions.push( 
          [...Array(xDimension)].map((_, i) => {
            return gridCoordinatesToSquareIndex(x+i, y  , xDimension) // -
          })
        )
        possible_solutions.push( 
          [...Array(xDimension)].map((_, i) => {
            return gridCoordinatesToSquareIndex(x+i, y+i, xDimension) // \
          })
        )
        possible_solutions.push( 
          [...Array(xDimension)].map((_, i) => {
            return gridCoordinatesToSquareIndex(x+i, y-i, xDimension) // /
          })
        )
      } else if (y === 0) {
        possible_solutions.push([...Array(yDimension)].map((_, j) => {
          return gridCoordinatesToSquareIndex(x, y+j, xDimension) // |
        }))
      }

    }
  }

  let solutions = [];
  possible_solutions.forEach((solution) => {
    if (solutionValid(solution)) {
      solutions.push(solution);
    }
  });

  for (let i = 0; i < solutions.length; i++) {
    let solution = solutions[i];
    let values = [];

    solution.forEach((index) => {
      values.push(squares[index]);
    });

    if (values.includes(null)) {
      continue;
    }

    const allEqual = values.every((value, _, arr) => value === arr[0]);

    if (allEqual) {
      return values[0];
    }

  }
  return null;
}
