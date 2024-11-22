import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { InputGroup, ListGroup } from 'react-bootstrap';


function ItemSection({ itemData }) {

  const items = itemData.map((item) => {
    return (
      <div key={item.id}>
        {item.name} - {item.description}
      </div>
    )
  });

  return (
    items
  )
}

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
      <div key={j} className="board-row" >
        {boardSquares}
      </div>
    );

  })

  return (
    <>
      <Row>
        <Col>
          <h3>{status}</h3>
        </Col>
      </Row>
      <Row>
        <Col >
          {boardRows}
        </Col>
      </Row>
    </>
  );
}

export function Game() {
  const [xDimension, setXDimension] = useState(3);
  const [yDimension, setYDimension] = useState(3);
  const [history, setHistory] = useState([Array(xDimension * yDimension).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const [items, setItems] = useState([]);

  const fetchData = async () => {
    let res = await fetch('http://192.168.1.10/api/inventoryitems');
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    console.log("Loading item data");
    fetchData();
  }, []);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function reset() {
    setHistory([Array(xDimension * yDimension).fill(null)]);
    setCurrentMove(0);
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
      <ListGroup.Item
        key={move}
        variant="secondary"
        action
        onClick={() => jumpTo(move)}
        active={move === currentMove ? "active" : "" }
      >
      {description}
      </ListGroup.Item>
    );
  });

  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 3, offset: 3}}>
          <InputGroup>
            <InputGroup.Text>X</InputGroup.Text>
            <Form.Control
              type="number"
              name="xDimension"
              value={xDimension}
              disabled = {currentMove > 0 ? "disabled" : "" }
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value < 1) {
                  value = 1;
                } else if (value > 50) {
                  value = 50;
                }
                setXDimension(value);
                reset();
              }}
            />
          </InputGroup>
        </Col>
        <Col md={{ span: 3}}>
          <InputGroup>
            <InputGroup.Text>Y</InputGroup.Text>
            <Form.Control
              type="number"
              name="yDimension"
              value={yDimension}
              disabled = {currentMove > 0 ? "disabled" : "" }
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value < 1) {
                  value = 1;
                } else if (value > 50) {
                  value = 50;
                }
                setYDimension(value);
                reset();
              }}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Board
            xDimension={xDimension}
            yDimension={yDimension}
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </Col>
      </Row>
      <Row>
        <Col md="3">          
          <ListGroup>
            <ListGroup.Item
              key="-1"
              variant="secondary"
              action
              onClick={() => reset()}
            >
            Reset Game
            </ListGroup.Item>
            {moves}
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <ItemSection itemData={items}></ItemSection>
        </Col>
      </Row>
    </Container>
    
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

  let possibleSolutions = [];

  for (let x = 0; x < xDimension; x++) {
    for (let y = 0; y < yDimension; y++) {

      if (x === 0) {
        possibleSolutions.push( 
          [...Array(xDimension)].map((_, i) => {
            return gridCoordinatesToSquareIndex(x+i, y  , xDimension) // -
          })
        )
        possibleSolutions.push( 
          [...Array(xDimension)].map((_, i) => {
            return gridCoordinatesToSquareIndex(x+i, y+i, xDimension) // \
          })
        )
        possibleSolutions.push( 
          [...Array(xDimension)].map((_, i) => {
            return gridCoordinatesToSquareIndex(x+i, y-i, xDimension) // /
          })
        )
      }
      if (y === 0) {
        possibleSolutions.push([...Array(yDimension)].map((_, j) => {
          return gridCoordinatesToSquareIndex(x, y+j, xDimension) // |
        }))
      }

    }
  }

  let possibleSolutionsSet = new Set(possibleSolutions.map(JSON.stringify));
  let uniquePossibleSolutions = Array.from(possibleSolutionsSet).map(JSON.parse);

  let solutions = [];
  uniquePossibleSolutions.forEach((solution) => {
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
