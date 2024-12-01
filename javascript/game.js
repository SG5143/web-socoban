const TILE_PATH = 0;
const TILE_PLAYER = 2;
const TILE_BOX = 3;

export class Game {
    constructor() {
        this.levelManager = new LevelManager();
        this.map = null;
        this.player = null;
        this.boxes = [];
        this.goals = [];
        this.level = 1;
    }

    async start(level) {
        await this.levelManager.getLevel(level);

        let levelData = this.levelManager.levelJson; 
        this.map = new Map(levelData.map);  
        this.player = new Player(levelData.player.x, levelData.player.y);  
        this.boxes = levelData.boxes.map(box => new Box(box.x, box.y));  
        this.goals = levelData.goals.map(goal => new Goal(goal.x, goal.y));  
        this.level = levelData.level;
    }

    movePlayer(dir) {
        this.player.move(dir, this.map, this.boxes);

        this.updateMapWithPlayer();
        this.boxes.forEach(box => this.updateMapWithBox(box));

        if (this.isLevelComplete()) 
            alert(`${this.level}단계를 클리어 했습니다!`);
    }

    updateMapWithPlayer() {
        for (let row = 0; row < this.map.height; row++) {
            for (let col = 0; col < this.map.width; col++) {
                if (this.map.map[row][col] === TILE_PLAYER) 
                    this.map.map[row][col] = TILE_PATH;  
            }
        }

        this.map.map[this.player.y][this.player.x] = TILE_PLAYER;
    }

    // 박스 위치 업데이트
    updateMapWithBox(box) {
        // 박스 위치 업데이트
        this.map.map[box.y][box.x] = TILE_BOX;
    }


    isLevelComplete() {
        return this.goals.every(goal => goal.isCovered(this.boxes));
    }
}

class Map {
    constructor(map) {
        this.map = map;
        this.height = map.length;
        this.width = map[0].length;
    }

    isWalkable(x, y) {
        return this.map[y][x] !== 1; 
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(dir, map, boxes) {
        const [dx, dy] = this.getDirectionOffset(dir);
        const newX = this.x + dx;
        const newY = this.y + dy;

        if (map.isWalkable(newX, newY)) {
            const box = boxes.find(b => b.x === newX && b.y === newY);
            if (box) {
                if (box.move(dir, map, boxes)) {
                    this.x = newX;
                    this.y = newY;
                }
            } else {
                this.x = newX;
                this.y = newY;
            }
        }
    }

    getDirectionOffset(dir) {
        switch (dir) {
            case "ArrowUp": return [0, -1];
            case "ArrowDown": return [0, 1];
            case "ArrowLeft": return [-1, 0];
            case "ArrowRight": return [1, 0];
        }
    }
}

class Box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(dir, map, boxes) {
        const [dx, dy] = this.getDirectionOffset(dir);
        const newX = this.x + dx;
        const newY = this.y + dy;

        if (map.isWalkable(newX, newY) && !boxes.some(b => b.x === newX && b.y === newY)) {
            this.x = newX;
            this.y = newY;
            return true;
        }
        return false;
    }

    getDirectionOffset(dir) {
        switch (dir) {
            case "ArrowUp": return [0, -1];
            case "ArrowDown": return [0, 1];
            case "ArrowLeft": return [-1, 0];
            case "ArrowRight": return [1, 0];
        }
    }
}

class Goal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    isCovered(boxes) {
        return boxes.some(box => box.x === this.x && box.y === this.y);
    }
}

class LevelManager {
    levelJson;

    async getLevel(level) {
        let res_json = await fetch(`javascript/levels/level${level}.json`);
        this.levelJson = await res_json.json();
    }
}