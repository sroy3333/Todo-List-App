function addTodo() {
  const todoName = document.getElementById("todoName").value.trim();
  const todoDescription = document.getElementById("todoDescription").value.trim();

  if (todoName && todoDescription) {
      const todo = { name: todoName, description: todoDescription, completed: false };
      const todoItemDiv = document.createElement("div");
      todoItemDiv.innerHTML = `<input type="checkbox" id="${todoName}" onchange="updateTodo('${todoName}')">
                               <label for="${todoName}"><strong>${todo.name}</strong>: ${todo.description}</label>`;
      document.getElementById("remainingTodos").appendChild(todoItemDiv);
      document.getElementById("todoName").value = "";
      document.getElementById("todoDescription").value = "";
      updateTodoAPI(todo);

      // Create and append the delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = function () {
          deleteTodo(todo._id, todoItemDiv);
      };
      todoItemDiv.appendChild(deleteButton);
  }
}

function deleteTodo(todoId, divItem) {
  // Make a DELETE request to remove the todo from the API
  axios.delete(`https://crudcrud.com/api/94cbef9db42f466aa820b2f87ab7a685/todos/${todoId}`)
      .then(response => {
          console.log('Todo deleted successfully:', response);

          // Remove the todo details from the website
          divItem.remove();
      })
      .catch(error => console.error('Error deleting todo:', error));
}
function updateTodo(todoName) {
  const todoCheckbox = document.getElementById(todoName);
  const todoLabel = todoCheckbox.nextElementSibling;
  const completedTodosDiv = document.getElementById("completedTodos");
  const remainingTodosDiv = document.getElementById("remainingTodos");

  todoLabel.style.textDecoration = todoCheckbox.checked ? "line-through" : "none";
  (todoCheckbox.checked ? completedTodosDiv : remainingTodosDiv).appendChild(todoCheckbox.parentNode);
  updateTodoAPI({ name: todoName, description: todoLabel.textContent.split(': ')[1], completed: todoCheckbox.checked });
}

function updateTodoAPI(todo) {
  const apiUrl = 'https://crudcrud.com/api/94cbef9db42f466aa820b2f87ab7a685/todos';

  fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
  })
  .then(response => response.json())
  .then(data => console.log('Todo Details:', data))
  .catch(error => console.error('Error updating todo in API:', error));
}
