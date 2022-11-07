// ========================================
// on page load
// ========================================
window.addEventListener("load", () => {
  // loads and parses all todos
  loadAllTodos();

  // displays section with all todos on page load
  displayTodos();

  // resets new todo textarea if there was something before page load
  newTodoTextareaReset();

  // scrolls section to top
  todoSection.scrollTop = 0;
});

// ========================================
// listen for "enter" submit and create new todo
// ========================================
const submitNewTodo = document.getElementById("create-todo");

submitNewTodo.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    // after pressing enter text area will not make a new line
    event.preventDefault();

    if (submitNewTodo.value == "") {
      alert("Please enter a todo");
    } else {
      const todo = {
        content: submitNewTodo.value,
        completed: false,
      };

      // puts newly created todo at the start of JSON
      allTodos.unshift(todo);

      // saves newly created todo
      saveAllTodos();

      // resets newTodo input
      newTodoTextareaReset();

      // relaods section with todos
      displayTodos();
    }
  }
});

// ========================================
// loads JSON file, if empty - loads empty string and stores it in global variable
// ========================================
function loadAllTodos() {
  allTodos = JSON.parse(localStorage.getItem("todos")) || [];
}

// ========================================
// saves all todos in JSON file as key = "todos"
// ========================================

function saveAllTodos() {
  localStorage.setItem("todos", JSON.stringify(allTodos));
}

// ========================================
// resets new todo textarea
// ========================================

function newTodoTextareaReset() {
  submitNewTodo.value = "";
  submitNewTodo.style.height = "1rem";
  submitNewTodo.style.width = "100%";
}

// ========================================
// displays all todos in "section" function
// ========================================
const todoSection = document.querySelector("section");

function displayTodos() {
  // calls below function on site laod
  todoCounterUpdate();

  // sets style for All button
  resetClickedButton();

  // resets todoSection content
  todoSection.innerHTML = "";

  // for creating new todo and adding all functionality for its inputs
  allTodos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo");
    todoItem.draggable = true;
    todoItem.addEventListener("dragstart", () => {
      todoItem.classList.add("dragging");
      todoItem.style.opacity = 0.5;
    });
    todoItem.addEventListener("dragend", () => {
      todoItem.classList.remove("dragging");
      todoItem.style.opacity = 1;
    });

    const checkbox = document.createElement("input");
    const tickImg = document.createElement("img");
    const todoText = document.createElement("textarea");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const crossImg = document.createElement("img");

    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.classList.add("check-box");

    tickImg.src = "./images/icon-check.svg";

    todoText.value = todo.content;
    todoText.readOnly = true;
    todoText.style.height = 1 + "rem";
    todoText.style.height = todoText.style.height + 2 + "px";

    editButton.classList.add("edit-button");
    editButton.textContent = "E";

    deleteButton.classList.add("delete-button");

    crossImg.src = "./images/icon-cross.svg";

    checkbox.appendChild(tickImg);
    deleteButton.appendChild(crossImg);

    todoItem.appendChild(checkbox);
    todoItem.appendChild(todoText);
    todoItem.appendChild(editButton);
    todoItem.appendChild(deleteButton);

    todoSection.appendChild(todoItem);

    // on page load for every todo.done = true -> adds active class
    if (todo.completed) {
      todoItem.classList.add("active");
    }

    // saves checkbox option for todo and sets "active" class accordingly
    checkbox.addEventListener("click", () => {
      todo.completed = checkbox.checked;
      saveAllTodos();

      if (todo.completed) {
        todoItem.classList.add("active");
      } else {
        todoItem.classList.remove("active");
      }

      // updates todo count
      todoCounterUpdate();
    });

    // lets user edit todo on section
    editButton.addEventListener("click", () => {
      todoText.readOnly = false;
      todoText.focus();
      todoText.style.outline = " 1px solid #c058f3";
      editButton.style.color = "#c058f3";
      editButton.classList.add("active");
      todoItem.draggable = false;

      todoText.addEventListener("blur", saveEdit);
      todoText.addEventListener("keypress", saveEdit);

      // function for saving edits for 2 event listeners
      function saveEdit(e) {
        if (e.type == "blur" || (e.type == "keypress" && e.key == "Enter")) {
          todoText.readOnly = true;
          todoText.style.outline = "none";
          todo.content = todoText.value;
          editButton.style.color = "#57ddff";
          editButton.classList.remove("active");
          todoItem.draggable = true;
          saveAllTodos();
        }
      }
    });

    // deletes todo, saves new JSON and refreshes todo section
    deleteButton.addEventListener("click", () => {
      allTodos = allTodos.filter((eachTodo) => eachTodo != todo);
      saveAllTodos();

      // updates section
      displayTodos();
    });
  });
  // sets text area height for every todo
  textareaHeight();
}

// ========================================
//  text area height setter function
// ========================================

function textareaHeight() {
  const textareas = document.querySelectorAll("textarea");

  textareas.forEach((textarea) => {
    textarea.style.height = textarea.scrollHeight + "px";
    textarea.addEventListener("input", () => {
      textarea.style.height = textarea.scrollHeight + "px";
    });
  });
}

// ========================================
// active todos counter
// ========================================
const todoCounter = document.querySelector(".todo-counter");

function todoCounterUpdate() {
  let allTodoNumber = 0;
  allTodos.forEach((eachTodo) => {
    if (eachTodo.completed == false) {
      allTodoNumber++;
    }
  });

  if (allTodoNumber != 1) {
    todoCounter.innerHTML = `${allTodoNumber} items left`;
  } else {
    todoCounter.innerHTML = `${allTodoNumber} item left`;
  }
}

// ========================================
// show todos: All, Active and Completed buttons for todos
// ========================================
const footerButtons = document.querySelectorAll(".footer-button");

footerButtons.forEach((footerButton) => {
  footerButton.addEventListener("click", () => {
    const allHTMLTodos = document.querySelectorAll(".todo");

    allHTMLTodos.forEach((todo) => {
      todo.style.display = "grid";
      if (footerButton.value == "Completed" && !todo.classList.contains("active")) {
        todo.style.display = "none";
      } else if (footerButton.value == "Active" && todo.classList.contains("active")) {
        todo.style.display = "none";
      }
      activatedClickedButton(footerButton);
    });
  });
});

// ========================================
// function for font color style in CSS for All, Active and Completed buttons
// ========================================
function activatedClickedButton(button) {
  footerButtons.forEach((footerButton) => {
    footerButton.classList.remove("active");
  });
  button.classList.add("active");
}

// ========================================
// puts All buttons to active state
// ========================================
const allTodosButton = document.getElementById("show-all-button");
const allTodosButtonMobile = document.getElementById("show-all-button-mobile");

function resetClickedButton() {
  footerButtons.forEach((footerButton) => {
    footerButton.classList.remove("active");
  });
  allTodosButton.classList.add("active");
  allTodosButtonMobile.classList.add("active");
}

// ========================================
// deletes all completed todos button and saves JSON
// ========================================
const clearCompletedButton = document.querySelector(".clear-comleted");

clearCompletedButton.addEventListener("click", () => {
  todoSection.childNodes.forEach((childNode) => {
    if (childNode.classList.contains("active")) {
      allTodos = allTodos.filter((eachTodo) => eachTodo.completed == false);

      saveAllTodos();
      displayTodos();
    }
  });
});

// ========================================
// dark mode buttons
// ========================================
const darkModeButton = document.querySelector(".dark-mode");
const body = document.querySelector("body");

darkModeButton.addEventListener("click", () => {
  body.classList.toggle("dark");
});

// ========================================
// drag and drop
// ========================================

todoSection.addEventListener("dragover", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("todo") && !e.target.classList.contains("dragging")) {
    const draggingTodo = document.querySelector(".dragging");
    const todos = document.querySelectorAll(".todo");
    let arrayOfTodosObjects = [];

    todos.forEach((todo) => {
      arrayOfTodosObjects.push(todo);
    });

    const currPos = arrayOfTodosObjects.indexOf(draggingTodo);
    const newPos = arrayOfTodosObjects.indexOf(e.target);

    if (currPos > newPos) {
      todoSection.insertBefore(draggingTodo, e.target);
    } else {
      todoSection.insertBefore(draggingTodo, e.target.nextSibling);
    }

    // removedDraggedTodo is array containing 1 object (currPos)
    const removedDraggedTodo = allTodos.splice(currPos, 1);
    allTodos.splice(newPos, 0, removedDraggedTodo[0]);
    saveAllTodos();
  }
});
