import React from 'react';
import GameBoardDisplay from './components/GameBoardDisplay';
import Player from './logic/player';
import './styles/App.css';

const human = new Player('human');
human.placeRandomShips();
human.board.lockShipsInPlace();
const cpu = new Player('cpu');
cpu.autoAttackDelay = 1.9;

human.opponent = cpu;
cpu.opponent = human;


const App = () => {
  return (
    <div id="boards-container">
      <GameBoardDisplay owner={human}/>
      <GameBoardDisplay owner={cpu} />
    </div>
  );
}

export default App;