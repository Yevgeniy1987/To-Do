const createForm = document.getElementById("create-form");

const todosWrapper = document.getElementById("todos");

// const todoList = document.getElementById('todo-list');
// const doingList = document.getElementById('doing-list');
// const doneList = document.getElementById('done-list');

const todoLists = {
  todo: document.getElementById("todo-list"),
  doing: document.getElementById("doing-list"),
  done: document.getElementById("done-list"),
};

const todos = {
  todo: TODOS.filter((todo) => todo.status === "todo"),
  doing: TODOS.filter((todo) => todo.status === "doing"),
  done: TODOS.filter((todo) => todo.status === "done"),
};

renderAllTodos(todoLists, todos);

function renderAllTodos(lists, todos) {
  //   todos.todo = TODOS.filter((todo) => todo.status === 'todo');
  //   todos.doing = TODOS.filter((todo) => todo.status === 'doing');
  //   todos.done = TODOS.filter((todo) => todo.status === 'done');

  //   renderTodoList(lists.todo, todos.todo, true)
  //   renderTodoList(lists.doing, todos.doing, true)
  //   renderTodoList(lists.done, todos.done, true)

  for (const key in lists) {
    todos[key] = TODOS.filter((todo) => todo.status === key);

    const listByStatus = lists[key];
    const todosByStatus = todos[key];

    renderTodoList(listByStatus, todosByStatus, true);
  }
}

function createTodoHTMLTemplate(todo) {
  let actionButton = "";

  const { status } = todo;

  if (status === "todo") {
    actionButton = `<button data-action="start">Start</button>`;
  }
  if (status === "doing") {
    actionButton = `<button data-action="finish">Finish</button>`;
  }
  if (status === "done") {
    actionButton = `<button data-action="delete">Delete</button>`;
  }

  const { id, content, createdAt, priority, updatedAt } = todo;
  const { title, description } = content;

  return `<div class="border p-3">
  <h2 class="title">${title}</h2>
  <p class="description">${description}</p>
  <span>${priority}</span>
  <span>${createdAt}</span>
  <span>${updatedAt}</span>
  ${actionButton}
  </div>`;
}

function renderTodoList(list, todos, clear) {
  if (clear) {
    list.innerHTML = "";
  }
  todos.forEach((todo) => {
    const todoHTML = createTodoHTMLTemplate(todo);
    list.insertAdjacentHTML("beforeend", todoHTML);
  });
}
   