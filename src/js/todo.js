const todoTasks = document.getElementById('todo__tasks');
const addBtn = document.getElementById('add_button');

const getUserInputs = () => {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  return { title, description };
};

const clearForm = () => document.getElementById('form').reset();

const newTaskHtml = (title, description) => `<h1 class="todo__text todo__title active">${title}</h1>
    <p class="todo__text todo__description active">${description}</p>
    <button class="todo__remove_btn active" type="button">Remove</button>`;

const storeTasks = () => {
  const currentTasks = todoTasks.innerHTML;
  localStorage.removeItem('toDoState');
  localStorage.setItem('toDoState', currentTasks);
};

const pushToHistory = () => {
  const currentTasks = todoTasks.innerHTML;
  window.history.pushState(currentTasks, null, null);
};

const addTask = (title, description) => {
  if (title || description) {
    clearForm();

    const newTask = document.createElement('article');
    newTask.className = 'todo__card active';
    newTask.innerHTML = newTaskHtml(title, description);
    todoTasks.append(newTask);

    storeTasks();
    pushToHistory();
  }
};

const removeTask = (event) => event.target.parentElement.remove();

const getTaskElem = (elem) => (elem.tagName === 'ARTICLE' ? elem : elem.parentElement);

const changeTaskState = (task) => {
  task.classList.toggle('active');
  task.classList.toggle('done');

  for (let i = 0; i < task.children.length; i += 1) {
    task.children[i].classList.toggle('active');
    task.children[i].classList.toggle('done');
  }
};

const body = document.getElementById('body');
body.onload = () => {
  const storedTasks = localStorage.getItem('toDoState');
  if (storedTasks) {
    todoTasks.innerHTML = storedTasks;
  }
  pushToHistory();
};

addBtn.addEventListener('click', (event) => {
  event.preventDefault();

  const { title, description } = getUserInputs();
  addTask(title, description);
});

todoTasks.addEventListener('click', (event) => {
  const eventTargetClasses = Array.from(event.target.classList);
  if (eventTargetClasses.includes('todo__remove_btn')) {
    removeTask(event);
  } else {
    const task = getTaskElem(event.target);
    changeTaskState(task);
  }

  storeTasks();
  pushToHistory();
});

window.addEventListener('popstate', (event) => {
  const currentTasks = event.state;
  todoTasks.innerHTML = currentTasks;

  storeTasks();
});
