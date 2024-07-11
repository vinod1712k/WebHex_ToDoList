document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const filterAll = document.getElementById('filter-all');
    const filterCompleted = document.getElementById('filter-completed');
    const filterIncomplete = document.getElementById('filter-incomplete');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        tasks
            .filter(task => 
                filter === 'all' ? true : filter === 'completed' ? task.completed : !task.completed
            )
            .forEach(task => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                li.innerHTML = `
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="task-action" onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                        <button class="task-action" onclick="toggleComplete(${task.id})">
                            ${task.completed ? '<i class="fas fa-times"></i>' : '<i class="fas fa-check"></i>'}
                        </button>
                        <button class="task-delete-icon" onclick="deleteTask(${task.id})"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                taskList.appendChild(li);
            });
    };

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    });

    filterAll.addEventListener('click', () => renderTasks('all'));
    filterCompleted.addEventListener('click', () => renderTasks('completed'));
    filterIncomplete.addEventListener('click', () => renderTasks('incomplete'));

    window.editTask = (id) => {
        const newText = prompt('Edit the task text:');
        if (newText) {
            tasks = tasks.map(task => task.id === id ? { ...task, text: newText } : task);
            saveTasks();
            renderTasks();
        }
    };

    window.deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    window.toggleComplete = (id) => {
        tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
        saveTasks();
        renderTasks();
    };

    renderTasks();
});
