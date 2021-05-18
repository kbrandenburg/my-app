import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button 
        onClick={props.onClick}
        className={props.className}
      >
        {props.value}
      </button>
  );
}

class Board extends React.Component {
  //todo move logic for bgcolor to renderSquare
  renderSquare(i) {
    let bgColor = "square";
    if (this.props.line.includes(i)) {
      bgColor = "green";
    }
    
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={bgColor}
        line={this.props.line}
      />
    );
  }

  render() {
    
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
} 

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        line:[],
      }],
      stepNumber: 0,
      xIsNext: true,
      winrar: false,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber +1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    //const line = current.line

    let calculations = calculateWinner(squares);
    //window.alert("calc[winner]=" + calculations['winner'] + "  squares[i]=" + squares[i]);
    if (!squares[i]) {
      if (!calculations['winner']) {
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        calculations = calculateWinner(squares);
        if (!calculateWinner(squares)['winner']) {
          this.setState({
            winrar: false,
            history: history.concat([{squares: squares, line: calculations['line']}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
          });
        }
      }
    }
    //this alert tells us the darn squares is set its just not rendering
    //window.alert("squares[i] = " + squares[i]);
    
    if (calculations['winner']) {
      //we have to check AFTER modifying board to see if winner
      //but we also have to check for winner before attempting to mark board!
      this.setState({
        winrar: true,
        history: history.concat([{squares: squares, line: calculations['line']}]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
      
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)['winner'];

    const moves = history.map((step,move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winrar={this.state.winrar}
            line={current.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
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
      return {'winner':squares[a], 'line':lines[i]};
    }
  }
  return {'winner':null,'line':[]};
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

