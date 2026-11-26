var board = document.getElementById("board");
var rollBtn = document.getElementById("rollBtn");
var resetBtn = document.getElementById("resetBtn");
var diceVal = document.getElementById("diceVal");
var msg = document.getElementById("msg");
var p1PosText = document.getElementById("p1Pos");
var p2PosText = document.getElementById("p2Pos");
var p1Box = document.getElementById("p1Box");
var p2Box = document.getElementById("p2Box");

var ladders = { 4: 25, 13: 46, 33: 49, 42: 63, 50: 69, 62: 81, 74: 92 };
var snakes = { 27: 5, 40: 3, 43: 18, 54: 31, 66: 45, 76: 58, 89: 53, 99: 41 };

var pos = [1, 1];
var turn = 0;
var finished = false;

function createBoard() {
  board.innerHTML = "";
  for (var r = 9; r >= 0; r--) {
    for (var c = 0; c < 10; c++) {
      var num = r % 2 === 0 ? r * 10 + c + 1 : r * 10 + (10 - c);
      var cell = document.createElement("div");
      cell.className = "cell " + (num % 2 === 0 ? "c-even" : "c-odd");
      if (ladders[num]) cell.className += " ladder";
      if (snakes[num]) cell.className += " snake";

      var numLabel = document.createElement("span");
      numLabel.textContent = num;
      cell.appendChild(numLabel);

      if (ladders[num] || snakes[num]) {
        var tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = ladders[num] ? "L:" + ladders[num] : "S:" + snakes[num];
        cell.appendChild(tag);
      }

      var tokWrap = document.createElement("div");
      tokWrap.className = "tokens";
      tokWrap.id = "t-" + num;
      cell.appendChild(tokWrap);

      board.appendChild(cell);
    }
  }
  updateTokens();
}

function updateTokens() {
  var all = document.querySelectorAll(".tokens");
  for (var i = 0; i < all.length; i++) {
    all[i].innerHTML = "";
  }

  for (var p = 0; p < 2; p++) {
    var box = document.getElementById("t-" + pos[p]);
    if (box) {
      var dot = document.createElement("span");
      dot.className = "dot p" + (p + 1);
      dot.title = "Player " + (p + 1);
      box.appendChild(dot);
    }
  }

  p1PosText.textContent = pos[0];
  p2PosText.textContent = pos[1];
  p1Box.className = turn === 0 ? "player-info active" : "player-info";
  p2Box.className = turn === 1 ? "player-info active" : "player-info";
}

rollBtn.addEventListener("click", function () {
  if (finished) return;

  var dice = Math.floor(Math.random() * 6) + 1;
  diceVal.textContent = dice;

  var playerName = "Player " + (turn + 1);
  var nextPos = pos[turn] + dice;

  if (nextPos > 100) {
    msg.textContent = playerName + " rolled " + dice + " (needs exact number to reach 100).";
    turn = turn === 0 ? 1 : 0;
    updateTokens();
    return;
  }

  var note = "";
  if (ladders[nextPos]) {
    note = " -> Climbed ladder to " + ladders[nextPos] + "!";
    nextPos = ladders[nextPos];
  } else if (snakes[nextPos]) {
    note = " -> Bitten by snake, down to " + snakes[nextPos] + ".";
    nextPos = snakes[nextPos];
  }

  pos[turn] = nextPos;

  if (nextPos === 100) {
    msg.textContent = playerName + " rolled " + dice + " and won the game!";
    finished = true;
    rollBtn.disabled = true;
  } else {
    msg.textContent = playerName + " rolled " + dice + ", moved to " + nextPos + note;
    turn = turn === 0 ? 1 : 0;
  }

  updateTokens();
});

resetBtn.addEventListener("click", function () {
  pos = [1, 1];
  turn = 0;
  finished = false;
  rollBtn.disabled = false;
  diceVal.textContent = "-";
  msg.textContent = "Player 1 turn. Click Roll Dice.";
  updateTokens();
});

createBoard();
