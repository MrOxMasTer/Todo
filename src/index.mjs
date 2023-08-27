import "./styles.css";

let todoList = document.querySelector('.todo__list');

const inputTodo = document.querySelector('.todo__input');

const getTodosFromLocalStorage = () => {
  const StrArrayTodos = localStorage.getItem('todos');

  if (StrArrayTodos === 'undefined' || !StrArrayTodos ) {
    localStorage.setItem('todos', JSON.stringify([]));
    return JSON.parse(localStorage.getItem('todos'));
  }
  
  return JSON.parse(StrArrayTodos);
}

const deleteTodo = (todoItem) => {
  const getTodos = getTodosFromLocalStorage();

  const filterTodos = getTodos.filter((item) => item.id !== todoItem.id);

  localStorage.setItem('todos', JSON.stringify(filterTodos));

  displayingTodos();
}

// Создание todo на странице
const createTodoPage = (todoItem) => {
  const todo = document.createElement('li');
  todo.classList.add('todo__item');

  if(todoItem.complete) todo.classList.add('todo__item--complete');

  todo.addEventListener('click', () => {
    todo.classList.toggle('todo__item--complete');
    const getTodos = getTodosFromLocalStorage();

    const mapTodos = getTodos.map((item) => {
        if(item.id === todoItem.id) {
          return {
            ...item,
            complete: !item.complete,
          } 
        }

        return item;
    });

    localStorage.setItem('todos', JSON.stringify(mapTodos));
    displayingTodos();
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('todo__delete-btn');
  deleteButton.setAttribute('type', 'button');
  deleteButton.innerHTML = '&times;';

  todo.innerHTML = `<p class="todo__text">${todoItem.value}</p>`;
  
  deleteButton.addEventListener('click', () => deleteTodo(todoItem));
  todo.append(deleteButton);

  todoList.append(todo);
};

const displayingTodos = () => {
  const todosList = document.querySelectorAll('.todo__item');
  todosList.forEach((item) => item.remove());

  const todos = getTodosFromLocalStorage();

  const noCompleteTodos = [];
  const completeTodos = [];

  todos.forEach((item) => {
    if(item.complete) {
      completeTodos.push(item)
    } else {
      noCompleteTodos.push(item);
    };
  })

  noCompleteTodos.forEach((todoItem) => createTodoPage(todoItem));
  completeTodos.forEach((todoItem) => createTodoPage(todoItem));
}
displayingTodos();

const createTodo = () => {
  // Получаем из хранилища
  const todos = getTodosFromLocalStorage(); 
  // Достаем значение из инпута
  const textInput = inputTodo.value;

  // Создаем id по последнему элементу в массиве + 1
  const createId = () => {
    const todosLength = todos.length;

    if(todosLength === 0) {
      return 0;
    }

    const findBigId = () => {
      for(let i = 0, g = 0; i < todos.length; i++) {
          if(todos[i].id >= g) {
            g = todos[i].id + 1;
          }

          if(i+1 === todos.length) {
            return g;
          }
      }

      return todos[todos.length-1].id + 1;
    }

    const id = findBigId();
    return id;
  }

  const id = createId();

  // Создаем todo
  const todoItem = { 
    id, 
    value: textInput, 
    complete: false
  }

  // Перезаписываем массив в localStorage
  localStorage.setItem('todos', JSON.stringify([...todos, todoItem]));

  // отображаем todo на странице
  displayingTodos();
}

// Добавление todo 
const addTodoButton = document.querySelector('.todo__add-btn');
addTodoButton.addEventListener('click', createTodo);

// Удаляем первую todo
const deleteTodoFirst = document.querySelector('.todo__delete-btn-first');
deleteTodoFirst.addEventListener('click', () => {

  const todos = getTodosFromLocalStorage();
  const todoItem = todos.shift();

  deleteTodo(todoItem);
});

// Удаляем последнюю todo
const deleteTodoLast = document.querySelector('.todo__delete-btn-last');
deleteTodoLast.addEventListener('click', () => {

  const todos = getTodosFromLocalStorage();
  const todoItem = todos.pop();

  deleteTodo(todoItem);
});

const selectTodoEven = document.querySelector('.todo__select-btn-even');
selectTodoEven.addEventListener('click', () => {
    todoList.classList.toggle('todo__list_even');
});

const selectTodoOdd = document.querySelector('.todo__select-btn-odd');
selectTodoOdd.addEventListener('click', () => {
  todoList.classList.toggle('todo__list_odd');
});


