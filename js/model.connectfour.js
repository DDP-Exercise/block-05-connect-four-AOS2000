"use strict";

//TODO: Think of this model as the game-logic.
//      The model knows everything that is neccessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.

//TODO: Prepare some customEvents. The model should dispatch events when
//      - The Player Changes
//      - A stone was inserted
//      - The Game is over (Draw or Winner)
//      Don't forget to give your events a namespace.
//      For each customEvent, just make a >method< for your model-object,
//      that, when called, dispatches the event. Nothing else should
//      happen in those methods.


//TODO: Initiate the battlefield. Your model needs a representation of the
//      battlefield as data (two-dimensional array). Obviously, there are
//      no stones yet in the field.

//TODO: The model should offer a method to insert a stone at a given column.
//      If the stone can be inserted, the model should insert the stone,
//      dispatch an event to let the world know that the battlefield has changed
//      and check if the game is over now.
//      Hint: This method will be called later by your controller, when the
//      user makes an according input.

//TODO: Methods to check if the game is over, either by draw or a win.
//      Let the world know in both cases what happend. If it's a win,
//      Don't forget to store the winning stones and add this >detail<
//      to your custom event.

//TODO: Method to change the current player (and dispatch the according event).
export const model = {
    board: [],
    currplayer: null,
    player1: { firstName: "Nacho", color: "Red" },
    player2: { firstName: "Pablo", color: "Yellow" },
    rows: 6,
    columns: 7,
    gameover: false,
    currColumns: [],

    init() {
        this.board = Array(this.rows).fill(null).map(() => Array(this.columns).fill(''));
        this.currplayer = this.player1;
        this.gameover = false;
        this.currColumns = [5, 5, 5, 5, 5, 5, 5];
    },

    innerStone(c) {
        if (this.gameover) return;
        let r = this.currColumns[c];
        if (r < 0) return;

        this.board[r][c] = this.currplayer;
        this.dispatchStoneInserted(r, c);

        if (this.checkWinner()) {
            this.gameover = true;
            window.dispatchEvent(new CustomEvent("cf:game-over", {
                detail: { winner: this.currplayer.firstName }
            }));
            return;
        }

        this.changeplayer();
        this.currColumns[c]--;
    },
    checkWinner() {
        // Waagerecht
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.board[r][c] !== '' &&
                    this.board[r][c] === this.board[r][c+1] &&
                    this.board[r][c] === this.board[r][c+2] &&
                    this.board[r][c] === this.board[r][c+3]) {
                    return true;
                }
            }
        }

        // Senkrecht
        for (let c = 0; c < this.columns; c++) {
            for (let r = 0; r < this.rows - 3; r++) {
                if (this.board[r][c] !== '' &&
                    this.board[r][c] === this.board[r+1][c] &&
                    this.board[r][c] === this.board[r+2][c] &&
                    this.board[r][c] === this.board[r+3][c]) {
                    return true;
                }
            }
        }
        // Digonally
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.board[r][c] !== '' &&
                    this.board[r][c] === this.board[r+1][c+1] &&
                    this.board[r][c] === this.board[r+2][c+2] &&
                    this.board[r][c] === this.board[r+3][c+3]) {
                    return true;
                }
            }
        }
        // Diagonally
        for (let r = 3; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.board[r][c] !== '' &&
                    this.board[r][c] === this.board[r-1][c+1] &&
                    this.board[r][c] === this.board[r-2][c+2] &&
                    this.board[r][c] === this.board[r-3][c+3]) {
                    return true;
                }
            }
        }

        return false;
    },

    changeplayer() {
        this.currplayer = (this.currplayer === this.player1) ? this.player2 : this.player1;
        this.dispatchPlayerChanged();
    },

    dispatchStoneInserted(r, c) {
        // WICHTIG: row statt rows
        const event = new CustomEvent("cf:stone-inserted", {
            detail: { row: r, col: c, player: this.currplayer }
        });
        window.dispatchEvent(event);
    },

    dispatchPlayerChanged() {
        window.dispatchEvent(new CustomEvent("cf:player-changed", {
            detail: { player: this.currplayer }
        }));
    }
};