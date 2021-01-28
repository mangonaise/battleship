(this.webpackJsonpbattleship=this.webpackJsonpbattleship||[]).push([[0],{41:function(t,e,i){},42:function(t,e,i){},43:function(t,e,i){},44:function(t,e,i){},45:function(t,e,i){},46:function(t,e,i){},52:function(t,e,i){},53:function(t,e,i){},90:function(t,e,i){},91:function(t,e,i){"use strict";i.r(e);var n,o=i(0),r=i(1),s=i.n(r),a=i(8),c=i.n(a),l=(i(41),i(4)),h=(i(42),i(7)),u=i(18),d=i(22),p=i(10),f=i(11),b=i(3);!function(t){t[t.empty=0]="empty",t[t.missed=1]="missed",t[t.shipIntact=2]="shipIntact",t[t.shipHit=3]="shipHit",t[t.shipSunk=4]="shipSunk",t[t.knownEmpty=5]="knownEmpty"}(n||(n={}));var v=function(){function t(){Object(p.a)(this,t),this.cells=void 0,this.nextShipPlacement=null,this.isNextShipPlacementValid=!1,this.haveAllShipsSunk=!1,this.ships=[],this.sunkShipsInfo={},this._arePositionsLocked=!1,Object(b.d)(this),this.cells=this.initializeBoard()}return Object(f.a)(t,[{key:"initializeBoard",value:function(){return Array.from({length:10}).map((function(t){return Array.from({length:10}).map((function(t){return n.empty}))}))}},{key:"clear",value:function(){this.ships=[],this.nextShipPlacement=null,this.haveAllShipsSunk=!1,this.sunkShipsInfo={},this.cells=this.initializeBoard()}},{key:"prepareToPlaceShip",value:function(t){if(!t)throw new Error("No ship placement provided.");var e=t.ship,i=t.direction,n=t.row,o=t.column,r=n>=0&&o>=0&&("horizontal"===i?o:n)+e.size<=10;this.isNextShipPlacementValid=r&&!this.wouldShipsBeInContact(t),this.nextShipPlacement=t}},{key:"placeShip",value:function(){if(!this.nextShipPlacement)throw new Error("Can't place ship as there isn't one ready to place.");if(this.isNextShipPlacementValid){var t=this.nextShipPlacement.ship.size,e=this.predictCellsInShip(this.nextShipPlacement),i=this.nextShipPlacement.ship;i.cellPositions=e,i.direction=this.nextShipPlacement.direction,this.setStateOfCells(e,n.shipIntact),this.ships.push(i),this.isNextShipPlacementValid=!1,this.nextShipPlacement=null,this.sunkShipsInfo[t]={quantity:this.sunkShipsInfo[t]?this.sunkShipsInfo[t].quantity+1:1,sunk:0}}}},{key:"lockShipsInPlace",value:function(){this._arePositionsLocked=!0}},{key:"findCellsWithState",value:function(t){for(var e=[],i=0;i<10;i++)for(var n=0;n<10;n++){var o=this.cells[i][n];t.includes(o)&&e.push([i,n])}return e}},{key:"receiveAttack",value:function(t){var e=this.findShipAt(t);if(this.setStateOfCells([t],e?n.shipHit:n.missed),e){var i=e.cellPositions.find((function(e){return e[0]===t[0]&&e[1]===t[1]}));if(!i)throw new Error("Hmm... a ship was attacked but its attacked cell cannot be found.");var o=e.cellPositions.indexOf(i);e.hit(o),e.isSunk&&this.handleSunkShip(e),this.haveAllShipsSunk=this.ships.every((function(t){return t.hits.every((function(t){return"hit"===t}))}))}}},{key:"handleSunkShip",value:function(t){var e=this;t.cellPositions.forEach((function(t){e.cells[t[0]][t[1]]=n.shipSunk;var i=[].concat(Object(d.a)(e.getAdjacentCellPositions(t)),Object(d.a)(e.getCornerCellPositions(t))).filter((function(t){return void 0!==t})).filter((function(t){return e.cells[t[0]][t[1]]===n.empty}));e.setStateOfCells(i,n.knownEmpty)})),this.sunkShipsInfo[t.size].sunk+=1}},{key:"removeShipAt",value:function(t){var e=this.findShipAt(t);e&&(this.setStateOfCells(e.cellPositions,n.empty),this.ships=this.ships.filter((function(t){return t!==e})),this.sunkShipsInfo[e.size].quantity-=1)}},{key:"rotateShipAt",value:function(t){var e=this.findShipAt(t);if(!e)throw new Error("Can't rotate. No ship found at (".concat(t[0],", ").concat(t[1],")."));var i=e.cellPositions;this.setStateOfCells(i,n.empty);var o="horizontal"===e.direction?"vertical":"horizontal",r={ship:e,direction:o,row:e.originPosition[0],column:e.originPosition[1]};this.prepareToPlaceShip(r),this.isNextShipPlacementValid?(e.direction=o,this.ships=this.ships.filter((function(t){return t!==e})),this.placeShip()):this.setStateOfCells(i,n.shipIntact)}},{key:"findShipAt",value:function(t){return this.ships.find((function(e){return e.cellPositions.some((function(e){return e[0]===t[0]&&e[1]===t[1]}))}))}},{key:"wouldShipsBeInContact",value:function(t){var e,i=this.predictCellsInShip(t),o=Object(u.a)(i);try{for(o.s();!(e=o.n()).done;){var r=e.value;if(!this.getSurroundingCellStates(r).filter((function(t){return void 0!==t})).every((function(t){return t===n.empty})))return!0}}catch(s){o.e(s)}finally{o.f()}return!1}},{key:"getSurroundingCellStates",value:function(t){for(var e=t[0],i=t[1],n=[],o=e-1;o<=e+1;o++)for(var r=i-1;r<=i+1;r++){var s=r>=0&&r<=9,a=o>=0&&o<=9?this.cells[o]:void 0,c=a&&s?a[r]:void 0;n.push(c)}return n}},{key:"getCornerCellStates",value:function(t){var e=this.getSurroundingCellStates(t);return[e[0],e[2],e[6],e[8]]}},{key:"getAdjacentCellStates",value:function(t){var e=this.getSurroundingCellStates(t);return[e[1],e[3],e[5],e[7]]}},{key:"getCornerCellPositions",value:function(t){var e=t[0]-1>=0,i=t[0]+1<=9,n=t[1]-1>=0,o=t[1]+1<=9;return[e&&n?[t[0]-1,t[1]-1]:void 0,e&&o?[t[0]-1,t[1]+1]:void 0,i&&n?[t[0]+1,t[1]-1]:void 0,i&&o?[t[0]+1,t[1]+1]:void 0]}},{key:"getAdjacentCellPositions",value:function(t){return[t[0]-1>=0?[t[0]-1,t[1]]:void 0,t[1]-1>=0?[t[0],t[1]-1]:void 0,t[1]+1<=9?[t[0],t[1]+1]:void 0,t[0]+1<=9?[t[0]+1,t[1]]:void 0]}},{key:"predictCellsInShip",value:function(t){if(!t)throw new Error("No ship placement provided.");for(var e=t.ship,i=t.direction,n=t.row,o=t.column,r=[],s=0;s<e.size;s++)"horizontal"===i?r.push([n,o+s]):"vertical"===i&&r.push([n+s,o]);return r}},{key:"setStateOfCells",value:function(t,e){var i=this;t.forEach((function(t){return i.cells[t[0]][t[1]]=e}))}},{key:"numberOfShipsWithSize",value:function(t){return this.ships.filter((function(e){return e.size===t})).length}},{key:"arePositionsLocked",get:function(){return this._arePositionsLocked}}]),t}(),j=function(){function t(e){Object(p.a)(this,t),this.size=void 0,this.hits=void 0,this.isSunk=!1,this.direction="horizontal",this._cellPositions=[],this._originPosition=[-1,-1],this.size=e,this.hits=this.initializeHits()}return Object(f.a)(t,[{key:"initializeHits",value:function(){return Array.from({length:this.size}).map((function(t){return"intact"}))}},{key:"hit",value:function(t){this.hits[t]="hit",this.isSunk=this.hits.every((function(t){return"hit"===t}))}},{key:"cellPositions",get:function(){return this._cellPositions},set:function(t){this._cellPositions=t,this._originPosition=t.reduce((function(t,e){return[Math.min(t[0],e[0]),Math.min(t[1],e[1])]}),[10,10])}},{key:"originPosition",get:function(){return this._originPosition}}]),t}(),m=(i(43),Object(l.a)((function(t){var e=t.cell,i=t.owner,s=t.index,a=Object(r.useRef)(null),c=i.board;function l(){return[Math.floor(s/10),s%10]}function u(t){var e=l(),i=Object(h.a)(e,2),n=i[0],o=i[1],r={ship:new j(t.detail.size),direction:t.detail.direction,row:n,column:o};c.prepareToPlaceShip(r),c.isNextShipPlacementValid&&c.placeShip()}return Object(r.useEffect)((function(){a.current&&a.current.addEventListener("shipDrop",u)}),[]),Object(o.jsx)("div",{ref:a,className:"board-cell ".concat(function(t){var e="";if(e=["","cell-missed","","cell-hit","cell-sunk","cell-known-empty"][t],"human"===i.type)t===n.shipIntact&&(e+=" cell-user",c.arePositionsLocked||(e+=" cell-removeable")),c.arePositionsLocked&&(e+=" cell-uninteractable");else if(t!==n.empty&&t!==n.shipIntact)e+=" cell-uninteractable";else if(t===n.shipIntact){var o;(c.haveAllShipsSunk||(null===(o=i.opponent)||void 0===o?void 0:o.board.haveAllShipsSunk))&&(e+=" cell-user")}return 0===s?e+=" cell-top-left":9===s?e+=" cell-top-right":90===s?e+=" cell-bottom-left":99===s&&(e+=" cell-bottom-right"),"cpu"===i.type&&(e+=" cell-hoverable"),e}(e)),onClick:function(){var t,e=l(),o=Object(h.a)(e,2),r=o[0],s=o[1];c.arePositionsLocked?null===(t=i.opponent)||void 0===t||t.attack([r,s]):c.cells[r][s]===n.shipIntact&&c.removeShipAt([r,s])}})}))),S=(i(44),Object(l.a)((function(t){var e=t.board,i=[];for(var n in e.sunkShipsInfo)i.push({shipSize:parseInt(n),quantity:e.sunkShipsInfo[n].quantity,sunk:e.sunkShipsInfo[n].sunk});return Object(o.jsxs)("div",{className:"sunk-indicators-container",children:[Object(o.jsx)("div",{className:"sunk-ships-indicator-label",children:"Sunk ships"}),i.map((function(t){return Object(o.jsx)("div",{children:Array.from({length:t.quantity}).map((function(e,i){return Object(o.jsx)("span",{className:"sunk-indicator",children:Array.from({length:t.shipSize}).map((function(e,n){return Object(o.jsx)("span",{className:"indicator-cell ".concat(i<t.sunk?"indicator-sunk":"indicator-not-sunk")},n)}))},i)}))},t.shipSize)}))]})}))),k=Object(l.a)((function(t){var e,i=t.owner,n=i.board.haveAllShipsSunk||(null===(e=i.opponent)||void 0===e?void 0:e.board.haveAllShipsSunk);return Object(o.jsxs)("div",{className:"board-display-container",children:[Object(o.jsx)("div",{className:"board-owner-label",children:"human"===i.type?"Your board":"Opponent's board"}),Object(o.jsx)("div",{className:"board-grid ".concat(function(){var t="";n?t+="disabled-board":i.isPlayerTurn&&i.board.arePositionsLocked&&(t+="dimmed-board disabled-board");return t}()),children:i.board.cells.flat().map((function(t,e){return Object(o.jsx)(m,{cell:t,owner:i,index:e},e)}))}),"cpu"===i.type&&!n&&Object(o.jsx)(S,{board:i.board})]})})),y=(i(45),Object(l.a)((function(t){var e=t.players.find((function(t){return t.board.haveAllShipsSunk}));return e?Object(o.jsxs)("div",{id:"end-message-container",children:["human"===e.type?Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)("h3",{children:"Game over!"}),Object(o.jsx)("p",{children:"You fought valiantly, but your digital opponent ultimately prevailed."})]}):Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)("h3",{children:"Victory!"}),Object(o.jsxs)("p",{children:["Congratulations, human.",Object(o.jsx)("br",{}),"You are a fine strategist."]})]}),Object(o.jsx)("button",{onClick:function(){return window.location.reload()},id:"play-again-button",children:"Play again"})]}):null}))),O=(i(46),i(5)),g=i(6),x=function(){return Object(o.jsxs)("div",{className:"footer",children:[Object(o.jsx)("div",{children:"by mangonaise"}),Object(o.jsx)(O.a,{icon:g.e,color:"rgb(230, 101, 144)"}),Object(o.jsx)("a",{href:"https://github.com/mangonaise/battleship",children:"github"})]})},P=(i(52),i(53),i(34)),C=i.n(P),w=function(t){var e=t.size,i=t.display,n=t.direction,s=Object(r.useRef)(null),a=Object(r.useState)(!1),c=Object(h.a)(a,2),l=c[0],u=c[1];function d(t){s.current&&(s.current.style.zIndex=t.toString())}return Object(o.jsx)("div",{children:Object(o.jsx)(C.a,{nodeRef:s,defaultPosition:{x:0,y:0},position:{x:0,y:0},scale:1,onStart:function(){d(1),u(!0)},onStop:function(t){var i=document.elementsFromPoint(t.x,t.y).find((function(t){return t.classList.contains("board-cell")}));i&&i.dispatchEvent(new CustomEvent("shipDrop",{detail:{size:e,direction:n}})),d(0),u(!1)},children:Object(o.jsx)("div",{ref:s,className:"draggable-ship",style:{position:l?"absolute":"relative",display:i?"inline-flex":"none",flexDirection:l&&"vertical"===n?"column":"row"},children:Array.from({length:e}).map((function(t,i){return Object(o.jsx)("span",{className:"ship-placer-cell ".concat(0===i?"draggable-cell":""),style:p(e,i),children:0===i&&Object(o.jsx)(O.a,{icon:g.a})},i)}))})})});function p(t,e){var i="",o="";return l&&"vertical"===n?o=e<t-1?"none":"":i=e<t-1?"none":"",{borderRight:i,borderBottom:o}}},A=Object(l.a)((function(t){var e=t.user,i=Object(r.useState)("horizontal"),n=Object(h.a)(i,2),s=n[0],a=n[1];return Object(o.jsxs)("div",{id:"ship-placer-container",children:[Object(o.jsx)("h3",{children:"Place your ships to get started."}),Object(o.jsxs)("button",{onClick:function(){return e.board.clear()},className:"placement-option-button",children:[Object(o.jsx)(O.a,{className:"placement-option-icon",icon:g.g})," Clear board"]}),Object(o.jsxs)("button",{onClick:function(){return e.placeRandomShips(!0)},className:"placement-option-button",children:[Object(o.jsx)(O.a,{className:"placement-option-icon",icon:g.d})," Place randomly"]}),e.board.ships.length<10?Object(o.jsxs)("div",{children:[Object(o.jsx)("div",{id:"manual-placement-text",children:"Drag & drop"}),Object(o.jsxs)("div",{className:"direction-toggle-container",children:[Object(o.jsx)("button",{onClick:function(){return a("horizontal")},className:"placement-direction-button ".concat("horizontal"===s?"active-direction-button":""),children:Object(o.jsx)(O.a,{icon:g.b})}),Object(o.jsx)("button",{className:"placement-direction-button ".concat("vertical"===s?"active-direction-button":""),onClick:function(){return a("vertical")},children:Object(o.jsx)(O.a,{icon:g.c})}),Object(o.jsxs)("p",{children:["placing ",s,"ly"]})]})]}):Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)("h3",{style:{marginTop:"10px"},children:"Good to go!"}),Object(o.jsxs)("button",{onClick:function(){return e.board.lockShipsInPlace()},id:"start-button",className:"placement-option-button",children:[Object(o.jsx)(O.a,{className:"placement-option-icon",icon:g.f})," Start game"]})]}),Object(o.jsxs)("div",{children:[Object(o.jsx)("div",{className:"draggable-ship-group",children:Object(o.jsx)(w,{size:4,display:e.board.numberOfShipsWithSize(4)<1,direction:s})}),Object(o.jsx)("div",{className:"draggable-ship-group",children:Array.from({length:2}).map((function(t,i){return Object(o.jsx)(w,{size:3,display:e.board.numberOfShipsWithSize(3)<=i,direction:s},i)}))}),Object(o.jsx)("div",{className:"draggable-ship-group",children:Array.from({length:3}).map((function(t,i){return Object(o.jsx)(w,{size:2,display:e.board.numberOfShipsWithSize(2)<=i,direction:s},i)}))}),Object(o.jsx)("div",{className:"draggable-ship-group",children:Array.from({length:4}).map((function(t,i){return Object(o.jsx)(w,{size:1,display:e.board.numberOfShipsWithSize(1)<=i,direction:s},i)}))})]})]})})),z=Object(l.a)((function(t){var e=t.user;return Object(o.jsx)("h1",{id:"game-status",children:function(){var t,i="";if(e.board.arePositionsLocked)if(e.board.haveAllShipsSunk)i="You lose!";else if(null===(t=e.opponent)||void 0===t?void 0:t.board.haveAllShipsSunk)i="You win!";else{var n;e.isPlayerTurn?i=e.hasExtraTurn?"Hit! Extra move":"Your move":(null===(n=e.opponent)||void 0===n?void 0:n.isPlayerTurn)&&(i="Computer's move")}else i="Battleship";return i}()})})),N=i(35),I=i.n(N),E=i(21),T=i.n(E),H=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"human";Object(p.a)(this,t),this.board=void 0,this.type=void 0,this.opponent=null,this.isPlayerTurn=!1,this.hasExtraTurn=!1,this.autoAttackDelay=0,Object(b.d)(this),this.board=new v,this.type=e,"cpu"===this.type?(this.placeRandomShips(),this.board.lockShipsInPlace()):"human"===this.type&&(this.isPlayerTurn=!0)}return Object(f.a)(t,[{key:"placeRandomShips",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];e&&this.board.clear();for(var i=function(e){I()(e,(function(){for(var i=5-e;!t.board.isNextShipPlacementValid;){var n=Math.random()<.5?"horizontal":"vertical",o=Math.floor(10*Math.random()),r=Math.floor(Math.random()*(10-i)),s="horizontal"===n?[o,r]:[r,o];t.board.prepareToPlaceShip({ship:new j(i),direction:n,row:s[0],column:s[1]})}t.board.placeShip()}))},n=1;n<=4;n++)i(n)}},{key:"attack",value:function(t){if(!this.opponent)throw new Error("Can't attack as there is no opponent.");this.board.haveAllShipsSunk||this.opponent.board.haveAllShipsSunk||(this.opponent.board.receiveAttack(t),this.opponent.board.cells[t[0]][t[1]]===n.missed?(this.isPlayerTurn=!1,this.opponent.isPlayerTurn=!0,"cpu"===this.opponent.type&&this.opponent.autoAttackDelay>0&&this.opponent.autoAttack(),this.hasExtraTurn=!1):(this.hasExtraTurn=!0,"cpu"===this.type&&this.autoAttackDelay>0&&this.autoAttack()))}},{key:"autoAttack",value:function(){var t=this;if(!this.opponent)throw new Error("Can't auto attack. Opponent not found.");setTimeout((function(){return t.makeSmartMove()}),1e3*this.autoAttackDelay)}},{key:"makeSmartMove",value:function(){if(this.opponent){var t=this.opponent.board,e=t.findCellsWithState([n.shipHit]);if(0!==e.length){if(1!==e.length){var i,o=T()(e.filter((function(e){return 1===t.getAdjacentCellStates(e).filter((function(t){return t===n.shipHit})).length}))).map((function(e){var i=t.getAdjacentCellStates(e).indexOf(n.shipHit);return 0===i?e[0]+1<=9?[e[0]+1,e[1]]:void 0:1===i?e[1]+1<=9?[e[0],e[1]+1]:void 0:2===i?e[1]-1>=0?[e[0],e[1]-1]:void 0:3===i&&e[0]-1>=0?[e[0]-1,e[1]]:void 0})).filter((function(t){return void 0!==t})).filter((function(e){var i=t.cells[e[0]][e[1]];return i===n.empty||i===n.shipIntact})),r=Object(u.a)(o);try{for(r.s();!(i=r.n()).done;){var s=i.value;if(1===t.getSurroundingCellStates(s).filter((function(t){return t===n.shipHit||t===n.shipSunk})).length)return void this.attack(s)}}catch(c){r.e(c)}finally{r.f()}throw new Error("Logic error! Checked either end of hit cells and found no available space to attack.")}var a=T()(t.getAdjacentCellPositions(e[0]).filter((function(t){return void 0!==t})).filter((function(e){return t.cells[e[0]][e[1]]!==n.missed})).filter((function(e){return!t.getCornerCellStates(e).some((function(t){return t===n.shipHit||t===n.shipSunk}))})));this.attack(a[0])}else this.attackRandomCell()}}},{key:"attackRandomCell",value:function(){var t=this.opponent.board,e=t.findCellsWithState([n.empty,n.shipIntact]);if(0===(e=e.filter((function(e){return!t.getAdjacentCellStates(e).some((function(t){return t===n.shipHit||t===n.shipSunk}))&&!t.getCornerCellStates(e).some((function(t){return t===n.shipHit||t===n.shipSunk}))}))).length)throw new Error("No more positions for CPU to check. The game should have ended by now.");var i=Math.floor(Math.random()*e.length);this.attack(e[i])}}]),t}(),L=(i(90),new H("human")),M=new H("cpu");M.autoAttackDelay=1.4,L.opponent=M,M.opponent=L;var D=Object(l.a)((function(){return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(z,{user:L}),Object(o.jsx)("div",{id:"app-container",children:Object(o.jsxs)("div",{id:"game-container",children:[Object(o.jsx)(k,{owner:L}),!L.board.arePositionsLocked&&Object(o.jsx)(A,{user:L}),L.board.arePositionsLocked&&Object(o.jsx)(k,{owner:M}),Object(o.jsx)(y,{players:[L,M]})]})}),Object(o.jsx)(x,{})]})}));c.a.render(Object(o.jsx)(s.a.StrictMode,{children:Object(o.jsx)(D,{})}),document.getElementById("root"))}},[[91,1,2]]]);
//# sourceMappingURL=main.810ff159.chunk.js.map