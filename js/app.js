const createForm = document.getElementById("create-form");

const todosWrapper = document.getElementById("todos");

const URL_BASE = `http://localhost:3333`;

let TODOS = [];

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

//---------------------------------------------------------------------

workWithData("todos");

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;

  const title = form.title.value;
  const description = form.description.value;
  const priority = form.priority.value;

  const newToDo = {
    // id: window.crypto.randomUUID(),
    content: {
      title,
      description,
    },
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: null,
    priority,
  };
  fetch(`${URL_BASE}/todos`, {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
    body: JSON.stringify(newToDo),
  })
    .then((res) => res.json())
    .then((data) => {
      TODOS.push(data);
      renderAllTodos(todoLists, todos);
      form.reset();
    });
});

todosWrapper.addEventListener("click", (event) => {
  const actionButtonType = event.target.dataset.action;

  if (actionButtonType) {
    const currentActionButton = event.target;
    const currentActionButtonId = currentActionButton.dataset.todoid;
    const currentActionButtonIndx = TODOS.findIndex(
      (todo) => todo.id === currentActionButtonId
    );

    const currentTodo = TODOS[currentActionButtonIndx];

    fetch(`${URL_BASE}/todos/${currentActionButtonId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        status: "todo",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          const currentStatus = TODOS.slice(currentTodo.status);
          TODOS.push(currentStatus.status==="doing");
          currentTodo.updatedAt = new Date().toISOString();
          TODOS = data;
          renderAllTodos(todoLists, todos);
        }
      });

    // if (actionButtonType === "start" && currentTodo) {
    //   currentTodo.status = "doing";
    //   currentTodo.updatedAt = new Date().toISOString();
    // }
    // if (actionButtonType === "finish" && currentTodo) {
    //   currentTodo.status = "done";
    //   currentTodo.updatedAt = new Date().toISOString();
    // }

    fetch(`${URL_BASE}/todos/${currentActionButtonId}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        TODOS.splice(currentActionButtonIndx, 1);

        renderAllTodos(todoLists, todos);
      }
    });

    // if (actionButtonType === "delete" && currentTodo) {
    //   TODOS.splice(currentActionButtonIndx, 1);
    // }
    // renderAllTodos(todoLists, todos);
  }
});

//---------------------------------------------------------------------

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

  const { id, content, status, updatedAt, createdAt, priority } = todo;

  const { title, description } = content;

  if (status === "todo") {
    actionButton = `<button class="bg-blue-200 px-3 py-1 border rounded" data-action="start" data-todoid="${id}">Start</button>`;
  }
  if (status === "doing") {
    actionButton = `<button class="bg-green-200 px-3 py-1 border rounded" data-action="finish" data-todoid="${id}">Finish</button>`;
  }
  if (status === "done") {
    actionButton = `<button class="bg-red-200 px-3 py-1 border rounded" data-action="delete" data-todoid="${id}">Delete</button>`;
  }
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString();
  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleDateString()
    : "-";

  return `<div class="border p-3 flex flex-col gap-3">
  <h2 class="font-bold text-lg">${title}</h2>
  <p>${description}</p>
  <dl class="divide-y flex flex-col gap-1">
    <div class="flex justify-between">
      <dt>Priority:</dt>
      <dd class="capitalize">${priority}</dd>
    </div>
    <div class="flex justify-between">
      <dt>Created:</dt>
      <dd>${formattedCreatedAt}</dd>
    </div>
    <div class="flex justify-between">
      <dt>Updated:</dt>
      <dd>${formattedUpdatedAt}</dd>
    </div>
  </dl>
  
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

// function delayedAction(time, callback) {
//   setTimeout(() => {
//     callback();
//   }, time);
// }

// delayedAction(1000, () => {
//   document.body.style.background = "red";
// });
// delayedAction(3000, () => {
//   document.body.style.background = "green";
// });

// function headsAndTails(callback) {
//   setTimeout(() => {
//     const r = Math.random() > 0.5 ? "heads" : "tails";
//     callback(r);
//   }, 3000);
// }

// headsAndTails((result) => {
//   console.log(result, "Done");
// });

// headsAndTails((result) => {
//   if (result === "heads") {
//     document.body.style.backgroundColor = 'green';
//   } else {
//     document.body.style.backgroundColor = 'red';
//   }
// });

// function headsOrTails(resolve, reject) {
//   setTimeout(() => {
//     const r = Math.random() > 0.5 ? "heads" : "tails";
//     if (r === "heads") {
//       resolve(r);
//     } else {
//       reject(r);
//     }
//   }, 3000);
// }

// headsOrTails(
//   (result) => {
//     document.body.style.backgroundColor = "green";
//     console.log(`You won! It was ${result}`);
//   },
//   (error) => {
//     document.body.style.backgroundColor = "red";
//     console.log(`You lost! It was ${reject}`);
//   }
// );

function headsAndTails() {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      const r = Math.random() > 0.5 ? "heads" : "tails";
      if (r === "heads") {
        resolve(r);
      } else {
        reject(r);
      }
    }, 5000);
  });
}

const p = headsAndTails();

p.then((result) => {
  document.body.style.backgroundColor = "green";
})
  .catch((error) => {
    document.body.style.backgroundColor = "red";
  })
  .finally(() => {
    console.log("Game Over");
  });

function workWithData(path) {
  fetch(`${URL_BASE}/${path}`)
    .then((res) => res.json())
    .then((data) => {
      TODOS = data;
      renderAllTodos(todoLists, todos);
    });
}
