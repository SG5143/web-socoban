const TILE_PATH = 0;
const TILE_WALL = 1;
const TILE_PLAYER = 2;
const TILE_BOX = 3;
const TILE_GOAL = 4;
const TILE_GOAL_IN = 5;

// 맵(레벨) 데이터 json 파일 로드하기
async function loadLevel(level) {
    const res_json = await fetch(`javascript/levels/level${level}.json`);
    return await res_json.json();
}

// 타일 이미지 이름 가져오기
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

// 게임 보드 그리기
function createGameBoard(levelData) {
    const board = document.createElement("div");
    board.id = "board";

    const rows = levelData.map.length;
    const cols = levelData.map[0].length;

    for (let row = 0; row < rows; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.style.display = "flex";
        rowDiv.id = `row-${row}`;
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement("div");
            cell.id = `cell-${row}-${col}`;
            cell.className = getTileName(levelData.map[row][col]);

            rowDiv.appendChild(cell);
        }
        board.appendChild(rowDiv);
    }

    const gameContainer = document.getElementById("game");
    gameContainer.innerHTML = "";
    gameContainer.appendChild(board);
}

async function initializeGame() {
    const levelData = await loadLevel(1);
    createGameBoard(levelData);
}


window.onload = () => {
    initializeGame();
}