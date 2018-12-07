import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * just replace the Square class 
 * We don't need to worry about this...
 * @param {*} props 
 */
function Square(props){
  const redStyle={color:'red',}
  const blackStyle={color:'black',}
  return (
    <button className="square" onClick={props.onClick} style={props.match!==-1?redStyle:blackStyle}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={'square'+(i)}
        value={this.props.squares[i]}
        match={this.props.match.join().indexOf(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    var rows = [];
    for(var i=0;i<3;i++){
      rows.push(<div key={'rows'+(i)} className="board-row"></div>);
      for(var k=0;k<3;k++){
        rows.push(this.renderSquare(3*k+i));
      }
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      history:[{
        squares: Array(9).fill(null),
        position: Array(9).fill(null),
      }],
      match: [],
      reverse: false,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = this.getCurrentStep(this.state.reverse, this.state.history);
    const squares = current.squares.slice();
    const position = i;

    //retuen when there is a winner or occupy
    if(calculateWinner(squares) || squares[i]){
      return ;
    }

    const newStep = {
      squares: squares,
      position: position,
    };

    console.log(this.history);
    squares[i] = this.state.xIsNext ? 'X':'O';
    this.state.reverse ? this.state.history.unshift(newStep) : this.state.history.push(newStep);
    this.setState({
      history: this.state.history,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2)===0,
    });
  }

  handleReverse(i){
    console.log('handleReverse');
    this.setState({
      history: this.state.history.reverse(),
      reverse: !this.state.reverse,
    });
    this.render();
  }

  componentDidMount(){
    console.log('DidMount');
  }
  componentDidUpdate(){
    console.log('DidUpdate');
  }
  componentWillUnmount(){
    console.log('WilllUnmount');
  }
  
  render() {
    const history = this.state.history;
    const current = this.getCurrentStep(this.state.reverse, this.state.history);
    const winner = calculateWinner(current.squares);
    const matchMap = matchWinner(current.squares);
    const isFull = current.squares.indexOf(null)===-1;

    console.log(history);
    const moves = history.map((step, move)=>{
      const pIdx = history[move].position;
      const x = Math.floor(pIdx%3);
      const y = Math.floor(pIdx/3);

      const desc = this.isStartElement(this.state.reverse, move, this.state.history) ?
      'Go to game start' : 
      'Go to move #'+move + ' ('+x+','+y+')';
        return(
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              {(move+1===history.length) && <b>{desc}</b>}
              {(move+1!==history.length) && desc}
            </button>
          </li>
        );
    });
    
    let status = 
      winner ? 'Winner: ' + winner:
      isFull ? 'DRAW':
      'Next player: ' + (this.state.xIsNext ? 'X':'O')
    ;

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            match={matchMap}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol><button onClick={()=>this.handleReverse(history)}>reversal</button></ol>
          <ol key="movesKey" id="movesKey">{moves}</ol>
        </div>
      </div>
    );
  }

  isStartElement(isReverse, movement, history) {
    return (!isReverse && movement === 0) ||
      (isReverse && movement === history.length - 1);
  }
  getCurrentStep(isReverse, history){
    return isReverse?history[0]:history[history.length-1];
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function matchWinner(squares){
  let ans = [];
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
  for(let i=0; i<lines.length; i++){
    const [a,b,c] = lines[i];
    if (squares[a]&&squares[a] === squares[b]&&squares[a]===squares[c]){
      ans.push([a,b,c]);
    }
  }
  return ans;
}

function calculateWinner(squares){
  const ans = matchWinner(squares);
  if(ans.length<1){
    return null;
  }
  const [a,b,c]=ans[0];
  if (squares[a]&&squares[a] === squares[b]&&squares[a]===squares[c]){
    return squares[a]
  }
  return null;
}

//more challenge
/**
 * If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

Display the location for each move in the format (col, row) in the move history list.
Bold the currently selected item in the move list.
Rewrite Board to use two loops to make the squares instead of hardcoding them.
Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win.
When no one wins, display a message about the result being a draw.
 */