'use client'
import { useState, type MouseEventHandler } from "react";

type SquareValue = "X" | "O" | null;

interface SquareProps {
  value: SquareValue,
  onSquareClick: MouseEventHandler
}

function Square({value, onSquareClick}: SquareProps) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean,
  squares: SquareValue[],
  onPlay: (nextSquares: SquareValue[]) => void;
  
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  const winner = calculateWinner(squares);
  let status: string;

  if(winner){
    status = "Winner: " + winner;
  } else{
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Update value of individual square when user clicks it
  function handleClick(clickedSquare: number) {
    if(squares[clickedSquare] || calculateWinner(squares)){
      // Don't update if square is already filled, or if someone has won
      return;
    }
    const nextSquares: SquareValue[] = squares.slice();
    nextSquares[clickedSquare] = xIsNext ?  "X" : "O";

    onPlay(nextSquares);
  }


  return (
    <>
      <div className="status">{status}</div>

      
      {/*
      for int x = 0; x < 3; x++
        div open
        for int y = 0; y < 3; y++
          square val = squares(x * 3 + y) onSquareClick = handlecli(x * 3 + y)

      */}


      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 == 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: SquareValue[]){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;

    if(move > 0){
      description = 'Go to move #' + move;
    } else{
      description = 'Go to game start';
    }
    return (move === currentMove) ? (
      <li key={move}>You are at move #{move}</li>
    ) : (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// This *could* be defined inside the Board function; it is only down here so I don't have to look at it <3
function calculateWinner(squares: SquareValue[]) {
  let winner = null;

  // Hardcoded winning lines
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winner = squares[a];
    }
  }

  return winner;
}