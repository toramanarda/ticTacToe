import React, { useState } from 'react';
import './App.css';
import O from './img/GameO.svg';
import X from './img/GameX.svg';
import Logo from './img/Logo.svg';
import Retry from './img/RetryButton.svg';
import startO from './img/startO.svg';
import startX from './img/startX.svg';
import WinnerO from './img/WinnerO.svg';
import WinnerX from './img/WinnerX.svg';

function Square({ value, onSquareClick, style }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={style}
    >
      {value === 'X' ? <img src={X} alt="X" /> : value === 'O' ? <img src={O} alt="O" /> : null}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, onRestart }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const winningSquares = winner ? calculateWinningSquares(squares) : [];

  let status;
  if (winner) {
    status = (
      <div className='statusModal'>
        <img style={{width: 20}} src={xIsNext ? startX : startO} alt={xIsNext ? 'X' : 'O'} /><p className='turn'>TURN</p>
      </div>
    );
  } else if (squares.every(square => square)) {
    status = 'Beraberlik!';
  } else {
    status = (
      <div className='nextPlayer'>
        <img style={{width: 20}} src={xIsNext ? startX : startO} alt={xIsNext ? 'X' : 'O'} /><p className='turn'>TURN</p>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <img src={Logo} />
        <div className="status">{status}</div>
        <button onClick={onRestart} className='retryBtn'><img src={Retry} /></button>
      </div>
      <div className="board-row">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </>
  );
}

function calculateWinningSquares(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return [];
}

function Modal({ winner, winningSquares, onClose, onRestart }) {
  return (
    <div className="modal">
      <div className="modal-content">
        {winner ? (
          <div>
            <h6>PLAYER {winner} WINS!</h6>
            <h2 className='modalWinner' style={winner === 'O' ? {color:'#F2B137'} :{ color:'#31C3BD'} }>{winner === 'X' ? <img src={WinnerX} style={{width: 20}} /> : <img src={WinnerO} style={{width: 20}} /> } TAKES THE ROUND</h2>
          </div>
        ) : (
          <h2 style={{color: '#A8BFC9'}}>ROUND TIED</h2>
        )}
        <button className='quitBtn' onClick={onClose}>QUIT</button>
        <button className='nextBtn' onClick={onRestart}>NEXT ROUND</button>
      </div>
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    const winner = calculateWinner(nextSquares);
    if (winner || nextSquares.every(square => square)) {
      if (winner) {
        setScores(prevScores => ({ ...prevScores, [winner]: prevScores[winner] + 1 }));
      } else {
        setScores(prevScores => ({ ...prevScores, ties: prevScores.ties + 1 }));
      }
      setShowModal(true);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setShowModal(false);
    setScores({ X: 0, O: 0, ties: 0 }); 
  }

  function nextRound() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setShowModal(false);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === 0) {
      description = 'Oyunun başlangıcına git';
    } else {
      description = 'Hamle #' + move;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const winner = calculateWinner(currentSquares);
  const winningSquares = winner ? calculateWinningSquares(currentSquares) : [];

  return (
    <div className="container">
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onRestart={restartGame} />
        </div>
        {showModal && (
          <Modal
            winner={winner}
            winningSquares={winningSquares}
            onClose={() => setShowModal(false)}
            onRestart={nextRound} 
          />
        )}
        <div className="score-board">
          <div className="score" style={{backgroundColor: '#31C3BD'}}>
            <p>X <br /> <h2>{scores.X}</h2></p>
          </div>
          <div className="score" style={{backgroundColor: '#A8BFC9'}}>
            <p>TIES <br /> <h2>{scores.ties}</h2></p>
          </div>
          <div className="score">
            <p>O <br /> <h2>{scores.O}</h2></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
