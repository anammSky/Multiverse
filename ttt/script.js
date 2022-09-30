const state = {
  LOCKED: 0,
  PLAY: 1,
  GAMEOVER: 2,
};

let game = state.LOCKED;

document.getElementById("btn").addEventListener("click", (btn) => {
  const squares = document.getElementsByClassName("ttt-square");
  if (game === state.GAMEOVER || game === state.PLAY) resetboard(squares)
  
  startGame(squares);
  btn.target.textContent = "reset";
});

function startGame(squares) {
  game = state.PLAY;
  // make new board and player
  let board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
  const player = {
    num: 1,
    token: "X",
  };

  changeMessage(
    `Player ${player.num}, click on a square to place your ${player.token}`
  );

  Array.from(squares).forEach((sqr) => {
    sqr.addEventListener("click", () => {
      playGame(sqr, board, player); // add a reset board change
    });
  });
}

function playGame(sqr, board, player) {
  if (game === state.PLAY) {

    const boardBeforeMove = makeRegexBoard(board);

    if (isValid(sqr.id, boardBeforeMove)) {
      playToken(sqr, player.token, board);
    } else {
      changeMessage(
        `That square has already been played on, try again.
            Player ${player.num}, click on a square to place your ${player.token}`
      );
      return;
    }

    // check if the game is finisehd
    const boardAfterMove = makeRegexBoard(board);
    if (isWin(boardAfterMove, player)) {
      game = state.GAMEOVER;
      const message = `Player ${player.token} has won the game!`;
      gameOver(message);
      return;
    }

    if (isDraw(boardAfterMove)) {
      game = state.GAMEOVER;
      const message = `It's a tie, game over`;
      gameOver(message);
      return;
    }

    changePlayer(player);
    changeMessage(
      `Player ${player.num}, click on a square to place your ${player.token}`
    );
  }
}

function resetboard(squares) {
  Array.from(squares).forEach( sqr => sqr.textContent = '');
}

function gameOver(message) {
  changeMessage(message);
}

function isValid(sqrNum, board) {
  return /X|O/.test(board[Number(sqrNum) - 1]) ? false : true;
}

function isWin(board, player) {
  return [
    "###......",
    "...###...",
    "......###",
    "#..#..#..",
    ".#..#..#.",
    "..#..#..#",
    "#...#...#",
    "..#.#.#..",
  ]
    .map((combo) => {
      return new RegExp(combo.replace(/#/g, player.token));
    })
    .some((regex) => {
      return regex.test(board);
    });
}

function isDraw(board) {
  return /[X|O]{9}/.test(board);
}

function playToken(sqr, token, board) {
  sqr.textContent = token;
  board[sqr.id - 1] = token;
}

function changePlayer(player) {
  if (player.num === 1) {
    player.num = 2;
    player.token = "O";
  } else {
    player.num = 1;
    player.token = "X";
  }
}

function changeMessage(message) {
  document.getElementById("game_message").textContent = message;
}

function makeRegexBoard(board) {
  return board.join("");
}
