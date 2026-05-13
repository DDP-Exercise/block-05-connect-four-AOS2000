"use strict";

//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

//TODO: Update the field. Show the whole battlefield with all the stones
//      that are already played.

//TODO: Show the current player

//TODO: Notify the player when the game is over. Make it clear how the
//      Game ended. If it's a win, show the winning stones.
export const polishedView = {
    init(rows, cols) {
        const boardElement = document.getElementById("board");
        if (!boardElement) return;
        boardElement.innerHTML = "";

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let tile = document.createElement("div");
                tile.id = `${r}-${c}`;
                tile.classList.add("tile");
                tile.dataset.col = c.toString();
                boardElement.append(tile);
            }
        }
    }
};

window.addEventListener("cf:stone-inserted", (e) => {
    const { row, col, player } = e.detail; // Hier row (Einzahl)
    const tile = document.getElementById(`${row}-${col}`);
    if (tile) {
        const className = (player.color === "Red") ? "red-player" : "yellow-player";
        tile.classList.add(className);
    }
});
window.addEventListener("cf:player-changed", (e) => {
    const leftImg = document.querySelector(".left-char img");
    const rightImg = document.querySelector(".right-char img");
    if (!leftImg || !rightImg) return;

    if (e.detail.player.firstName === "Nacho") {
        leftImg.style.border = "5px solid Red";
        rightImg.style.border = "none";
    } else {
        rightImg.style.border = "5px solid Yellow";
        leftImg.style.border = "none";
    }
});
window.addEventListener("cf:game-over", (e) => {
    const winnerDisplay = document.getElementById("Winner");
    if (winnerDisplay) {
        winnerDisplay.innerText = e.detail.winner + " hat gewonnen! 🎉";
    }
    document.getElementById("board").style.opacity = "0.8";
});