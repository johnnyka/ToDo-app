const todoTasks = document.getElementById('todo__tasks');
const addBtn = document.getElementById('add_button');
let state = [];

const getUserInputs = () => {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  return { title, description };
};

const clearForm = () => document.getElementById('form').reset();

const pushToHistory = (tasks) => {
  window.history.pushState(tasks, null, null);
};

const storeTasks = (tasks) => {
  if (state === null) {
    state = [];
  } else if (state.length === 0) {
    pushToHistory();
    localStorage.removeItem('toDoState');
  } else {
    pushToHistory(tasks);
    localStorage.setItem('toDoState', JSON.stringify(tasks));
  }
};

const taskTemplate = (tasks) => {
  let htmlString = '';
  if (tasks) {
    for (let i = 0; i < tasks.length; i += 1) {
      htmlString += `<article class="todo__card ${tasks[i].done}">
      <h1 class="todo__text todo__title ${tasks[i].done}">${tasks[i].title}</h1>
      <p class="todo__text todo__description ${tasks[i].done}">${tasks[i].description}</p>
      <button class="todo__remove_btn ${tasks[i].done}" type="button">Remove</button>
      </article>`;
    }
  }
  return htmlString;
};

const renderPage = (tasksHtml) => {
  todoTasks.innerHTML = tasksHtml;
};

window.addEventListener('statechange', () => {
  renderPage(taskTemplate(state));
  storeTasks(state);
});

const addTask = (title, description) => {
  if (title || description) {
    clearForm();

    state = [...state, { title, description, done: 'active' }];
    window.dispatchEvent(new Event('statechange'));
  }
};

const removeTask = (index) => {
  state = state.filter((s, i) => i !== index);
  window.dispatchEvent(new Event('statechange'));
};

const getTaskElem = (elem) => (elem.tagName === 'ARTICLE' ? elem : elem.parentElement);

const updateTask = (index) => {
  const status = state[index].done === 'done' ? 'active' : 'done';
  state = state.map((s, i) => (i === index ? {
    title: s.title,
    description: s.description,
    done: status,
  } : s));

  window.dispatchEvent(new Event('statechange'));
};

const body = document.getElementById('body');
body.onload = () => {
  state = JSON.parse(localStorage.getItem('toDoState'));
  window.dispatchEvent(new Event('statechange'));
};

addBtn.addEventListener('click', (event) => {
  event.preventDefault();

  const { title, description } = getUserInputs();
  addTask(title, description);
});

todoTasks.addEventListener('click', (event) => {
  const eventTargetClasses = Array.from(event.target.classList);
  if (eventTargetClasses.includes('todo__remove_btn')) {
    const task = event.target.parentElement;
    const taskIndex = Array.from(todoTasks.children).indexOf(task);
    removeTask(taskIndex);
  } else {
    const task = getTaskElem(event.target);
    const taskIndex = Array.from(todoTasks.children).indexOf(task);

    updateTask(taskIndex);
  }
});

window.addEventListener('popstate', (event) => {
  renderPage(taskTemplate(event.state));
});
