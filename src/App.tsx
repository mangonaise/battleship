import { observer } from 'mobx-react-lite';
import React from 'react';
import GameBoardDisplay from './components/GameBoardDisplay';
import ShipPlacementMenu from './components/ShipPlacementMenu';
import Player from './logic/player';
import './styles/App.css';

const human = new Player('human');
const cpu = new Player('cpu');
cpu.autoAttackDelay = 1.4;

human.opponent = cpu;
cpu.opponent = human;


const App = () => {
  return (
    <div id="app-container">
      <div id="boards-container">
        <GameBoardDisplay owner={human}/>
        {!human.board.arePositionsLocked && <ShipPlacementMenu user={human}/>}
        {human.board.arePositionsLocked && <GameBoardDisplay owner={cpu}/>}
      </div>
    </div>
    
  );
}

export default observer(App);