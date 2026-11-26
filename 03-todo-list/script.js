var taskForm = document.getElementById("taskForm");
var taskInput = document.getElementById("taskInput");
var taskList = document.getElementById("taskList");

var tasks = [
  { text: "Revise DBMS normalization", done: true },
  { text: "Complete OS lab record", done: false },
  { text: "Practice Java LinkedList problems", done: false }
];

function render() {
  taskList.innerHTML = "";

  for (var i = 0; i < tasks.length; i++) {
    (function (index) {
      var li = document.createElement("li");
      li.className = tasks[index].done ? "task-item done" : "task-item";

      var left = document.createElement("div");
      left.className = "task-left";

      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = tasks[index].done;
      cb.addEventListener("change", function () {
        tasks[index].done = cb.checked;
        render();
      });

      var span = document.createElement("span");
      span.className = "task-label";
      span.textContent = tasks[index].text;

      left.appendChild(cb);
      left.appendChild(span);

      var btns = document.createElement("div");
      btns.className = "btn-group";

      var upBtn = document.createElement("button");
      upBtn.type = "button";
      upBtn.textContent = "Move Up";
      upBtn.disabled = index === 0;
      upBtn.addEventListener("click", function () {
        var temp = tasks[index - 1];
        tasks[index - 1] = tasks[index];
        tasks[index] = temp;
        render();
      });

      var downBtn = document.createElement("button");
      downBtn.type = "button";
      downBtn.textContent = "Move Down";
      downBtn.disabled = index === tasks.length - 1;
      downBtn.addEventListener("click", function () {
        var temp = tasks[index + 1];
        tasks[index + 1] = tasks[index];
        tasks[index] = temp;
        render();
      });

      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "del-btn";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", function () {
        tasks.splice(index, 1);
        render();
      });

      btns.appendChild(upBtn);
      btns.appendChild(downBtn);
      btns.appendChild(delBtn);

      li.appendChild(left);
      li.appendChild(btns);
      taskList.appendChild(li);
    })(i);
  }
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var val = taskInput.value.trim();
  if (val !== "") {
    tasks.push({ text: val, done: false });
    taskInput.value = "";
    render();
  }
});

render();
