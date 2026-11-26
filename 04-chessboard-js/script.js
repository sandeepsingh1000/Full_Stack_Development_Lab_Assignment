document.body.style.margin = "0";
document.body.style.padding = "30px";
document.body.style.fontFamily = "Arial, sans-serif";
document.body.style.backgroundColor = "#f1f5f9";
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.alignItems = "center";

var title = document.createElement("h2");
title.textContent = "8x8 Chessboard (Created using JS)";
title.style.margin = "0 0 16px 0";
title.style.color = "#0f172a";
document.body.appendChild(title);

var board = document.createElement("div");
board.style.display = "grid";
board.style.gridTemplateColumns = "repeat(8, 56px)";
board.style.gridTemplateRows = "repeat(8, 56px)";
board.style.border = "4px solid #0f172a";
document.body.appendChild(board);

var backRank = ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"];
var whiteBackRank = ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"];

for (var row = 0; row < 8; row++) {
  for (var col = 0; col < 8; col++) {
    var sq = document.createElement("div");
    var isLight = (row + col) % 2 === 0;

    sq.style.width = "56px";
    sq.style.height = "56px";
    sq.style.backgroundColor = isLight ? "#e2e8f0" : "#475569";
    sq.style.display = "flex";
    sq.style.alignItems = "center";
    sq.style.justifyContent = "center";
    sq.style.fontSize = "34px";
    sq.style.userSelect = "none";

    if (row === 0) sq.textContent = backRank[col];
    else if (row === 1) sq.textContent = "♟";
    else if (row === 6) sq.textContent = "♙";
    else if (row === 7) sq.textContent = whiteBackRank[col];

    board.appendChild(sq);
  }
}
