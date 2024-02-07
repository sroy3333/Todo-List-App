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
    }
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
    const apiUrl = 'https://crudcrud.com/api/4a59680e0559409abc2e481528bb4ec1/todos';

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
    })
    .then(response => response.json())
    .then(data => console.log('Todo Details:', data))
    .catch(error => console.error('Error updating todo in API:', error));
}
