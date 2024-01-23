let todos = [];

// Fetch existing todos from CRUD CRUD API on page load
window.onload = async function () {
    await fetchTodosFromAPI();
    displayTodos();
};

async function fetchTodosFromAPI() {
    try {
        const response = await fetch('https://crudcrud.com/api/7ce5430a0c5a4602a7b2b31703494c2e/todos');
        const data = await handleResponse(response);

        if (data) {
            todos = data;
        }
    } catch (error) {
        console.error('Error fetching todos from API:', error);
    }
}

function addTodo() {
    const todoName = document.getElementById('todoName').value;
    const todoDescription = document.getElementById('todoDescription').value;

    if (todoName.trim() !== '') {
        const newTodo = { name: todoName, description: todoDescription, completed: false };

        // Add todo to the local array
        todos.push(newTodo);

        // Display todos on the screen
        displayTodos();

        // Save todo to CRUD CRUD API
        createOrUpdateTodoAPI(newTodo);
    }

    // Clear input fields
    document.getElementById('todoName').value = '';
    document.getElementById('todoDescription').value = '';
}

function displayTodos() {
    const remainingTodosContainer = document.getElementById('remainingTodos');
    const completedTodosContainer = document.getElementById('completedTodos');

    remainingTodosContainer.innerHTML = '';
    completedTodosContainer.innerHTML = '';

    todos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        todoItem.innerHTML = `
            <span class="${todo.completed ? 'completed' : ''}">${todo.name} - ${todo.description}</span>
            <input type="checkbox" onchange="updateTodoStatus(${index})" ${todo.completed ? 'checked' : ''}>
            <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
        `;

        if (todo.completed) {
            completedTodosContainer.appendChild(todoItem);
        } else {
            remainingTodosContainer.appendChild(todoItem);
        }
    });
}

async function updateTodoStatus(index) {
    todos[index].completed = !todos[index].completed;

    // Update todo status on CRUD CRUD API
    await createOrUpdateTodoAPI(todos[index]);

    displayTodos();
}

async function deleteTodo(index) {
    // Delete todo from CRUD CRUD API
    const todoId = todos[index]._id; // Assuming '_id' is the identifier used by your API
    await deleteTodoFromAPI(todoId);

    // Remove todo from the local array
    todos.splice(index, 1);

    // Display todos on the screen after deleting from API
    displayTodos();
}

// Function to send a POST or PUT request to create or update a todo
async function createOrUpdateTodoAPI(data) {
    const apiUrl = 'https://crudcrud.com/api/7ce5430a0c5a4602a7b2b31703494c2e/todos';

    try {
        const response = await fetch(data._id ? `${apiUrl}/${data._id}` : apiUrl, {
            method: data._id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await handleResponse(response);

        if (response.ok) {
            console.log(`Todo ${data._id ? 'updated' : 'created'} successfully:`, responseData);
        } else {
            console.error(`Error ${data._id ? 'updating' : 'creating'} todo:`, responseData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to send a DELETE request to remove a todo
async function deleteTodoFromAPI(todoId) {
    const apiUrl = 'https://crudcrud.com/api/7ce5430a0c5a4602a7b2b31703494c2e/todos';

    try {
        const response = await fetch(`${apiUrl}/${todoId}`, {
            method: 'DELETE',
        });

        const responseData = await handleResponse(response);

        if (response.ok) {
            console.log('Todo deleted successfully:', responseData);
        } else {
            console.error('Error deleting todo:', responseData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Helper function to handle fetch response and parse JSON data
async function handleResponse(response) {
    try {
        const responseData = await response.text();
        return responseData ? JSON.parse(responseData) : null;
    } catch (error) {
        console.error('Error handling response:', error);
        return null;
    }
}