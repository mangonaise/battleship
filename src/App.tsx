import React from 'react';
import GameBoardDisplay from './components/GameBoardDisplay';
import Player from './logic/player';
import './styles/App.css';

const human = new Player('human');
human.placeRandomShips();
const cpu = new Player('cpu');

const App = () => {
  return (
    <div id="board-container">
      <GameBoardDisplay player={human}/>
      <GameBoardDisplay player={cpu} />
    </div>
  );
}


export default App;