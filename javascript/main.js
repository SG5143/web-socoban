function createGameBoard(row, col) {
    const board = document.createElement("div");
    board.id = "board";

    for (let i = 0; i < row; i++) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.id = "row" + i;
        for (let j = 0; j < col; j++)
            div.innerHTML += "<div class='map'></div>";
        board.appendChild(div);
    }

    const game = document.getElementById("game");
    game.appendChild(board);
}

window.onload = () => {
    createGameBoard(10, 10);
}