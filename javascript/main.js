import { Game } from './game.js';

const TILE_PATH = 0;
const TILE_WALL = 1;
const TILE_PLAYER = 2;
const TILE_BOX = 3;
const TILE_GOAL = 4;
const TILE_GOAL_IN = 5;

let game;
let currentLevel = 1; // 단계 -> 초기값은 1

// 해당 타일의 파일이름 가져오기
function getTileName(tileType) {
    switch (tileType) {
        case TILE_PATH:
            return 'path';
        case TILE_WALL:
            return 'wall';
        case TILE_PLAYER:
            return 'player';
        case TILE_BOX:
            return 'box';
        case TILE_GOAL:
            return 'goal';
        case TILE_GOAL_IN:
            return 'goal_in';
        default:
            return 'path';
    }
}

function getTileClass(gameInstance, row, col, tileType) {
    if (gameInstance.player.x === col && gameInstance.player.y === row)
        return getTileName(TILE_PLAYER);

    if (gameInstance.boxes.some(box => box.x === col && box.y === row)) {
        return getTileName(
            gameInstance.goals.some(goal => goal.x === col && goal.y === row) ? TILE_GOAL_IN : TILE_BOX
        );
    }

    if (gameInstance.goals.some(goal => goal.x === col && goal.y === row))
        return getTileName(TILE_GOAL);

    return getTileName(tileType);
}

function updateCellClass(row, col, gameInstance) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    const tileType = gameInstance.map.map[row][col];
    cell.className = getTileClass(gameInstance, row, col, tileType);
}

// 게임 보드 그리기
function createGameBoard(gameInstance) {
    const mapData = gameInstance.map;
    const board = document.createElement("div");
    board.id = "board";

    const rows = mapData.height
    const cols = mapData.width;

    for (let row = 0; row < rows; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.style.display = "flex";
        rowDiv.id = `row-${row}`;
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement("div");
            cell.id = `cell-${row}-${col}`;

            const tileType = mapData.map[row] && mapData.map[row][col];
            cell.className = getTileClass(gameInstance, row, col, tileType);

            rowDiv.appendChild(cell);
        }
        board.appendChild(rowDiv);
    }

    const gameContainer = document.getElementById("game");
    gameContainer.innerHTML = "";
    gameContainer.appendChild(board);
    createMenuGroup();
}

function createMenuGroup(){
    const gameContainer = document.getElementById("game");
    gameContainer.innerHTML +=`
    <div class="menu-group">
        <div class="level-control">
            <button id="decrease-level">-</button>
            <span id="current-level">${currentLevel}</span>
            <button id="increase-level">+</button>
        </div>
        <button id="set-level">선택 단계로 이동</button>
    </div>
    `;

    document.getElementById('decrease-level').addEventListener('click', () => handleLevel(-1));
    document.getElementById('increase-level').addEventListener('click', () => handleLevel(1));
    document.getElementById('set-level').addEventListener('click', () => initializeGame());
}

function handleLevel(increment) {
    const change = currentLevel + increment;
    if (change > 0 && change <= 5) { // 일단 임의로 5단계 나중에 추가하면 바꾸기 
        currentLevel = change;
        updateLevel();
    }
}

function updateLevel() {
    document.getElementById('current-level').innerText = currentLevel;
}


async function initializeGame() {
    game = new Game();
    await game.start(currentLevel);
    createGameBoard(game);
}


window.onload = () => {
    initializeGame();
    handleKey();
}


// 키 꾹 누르는거 방지하면서 입력 받는 메서드
function handleKey() {
    let keyPressed = false;

    window.addEventListener("keydown", (e) => {
        if (!keyPressed) {
            console.log(e.key);
            keyPressed = true;

            const previousPlayerPosition = { x: game.player.x, y: game.player.y }; 
            game.movePlayer(e.key);

            updateCellClass(previousPlayerPosition.y, previousPlayerPosition.x, game); 
            updateCellClass(game.player.y, game.player.x, game);
            
            game.boxes.forEach(box => {
                updateCellClass(box.y, box.x, game);
            });

            game.goals.forEach(goal => {
                updateCellClass(goal.y, goal.x, game);
            });
        }
    });

    // 키를 때야 다음 키 입력을 받을 수 있도록 하기 
    window.addEventListener("keyup", () => {
        keyPressed = false;
    });
}
