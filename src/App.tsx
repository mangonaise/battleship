import { observer } from 'mobx-react-lite';
import React from 'react';
import GameBoardDisplay from './components/GameBoardDisplay';
import GameEndMessage from './components/GameEndMessage';
import ShipPlacementMenu from './components/ShipPlacementMenu';
import StatusText from './components/StatusText';
import Player from './logic/player';
import './styles/App.css';

const human = new Player('human');
const cpu = new Player('cpu');
cpu.autoAttackDelay = 1.4;
human.opponent = cpu;
cpu.opponent = human;

const App = () => {
  return (
    <>
    <StatusText user={human}/>
    <div id="app-container">
      <div id="game-container">
        <GameBoardDisplay owner={human}/>
        {!human.board.arePositionsLocked && <ShipPlacementMenu user={human}/>}
        {human.board.arePositionsLocked && <GameBoardDisplay owner={cpu}/>}
        <GameEndMessage players={[human, cpu]}/>
      </div>
    </div>
    </>
  );
}

export default observer(App);