let draggedTaskId = null;

async function loadTasks() {
    try {
        const res = await fetch(`${API_BASE}/tasks`, { headers: getAuthHeaders() });
        if (res.status === 401) {
            handleLogout();
            return;
        }
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        console.error('Failed to load tasks:', err);
    }
}

function renderTasks(tasks) {
    const todoList = document.getElementById('todo-list');
    const inprogressList = document.getElementById('inprogress-list');
    const doneList = document.getElementById('done-list');
    let todoCount = 0, inprogressCount = 0, doneCount = 0;

    todoList.innerHTML = '';
    inprogressList.innerHTML = '';
    doneList.innerHTML = '';

    tasks.forEach(task => {
        const card = createTaskCard(task);
        switch (task.stage) {
            case 'TODO':
                todoList.appendChild(card);
                todoCount++;
                break;
            case 'IN_PROGRESS':
                inprogressList.appendChild(card);
                inprogressCount++;
                break;
            case 'DONE':
                doneList.appendChild(card);
                doneCount++;
                break;
        }
    });

    document.getElementById('todo-count').textContent = todoCount;
    document.getElementById('inprogress-count').textContent = inprogressCount;
    document.getElementById('done-count').textContent = doneCount;
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.taskId = task.id;

    card.innerHTML = `
        <h3>${escapeHtml(task.title)}</h3>
        ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ''}
        <div class="task-actions">
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;

    card.addEventListener('dragstart', (e) => {
        draggedTaskId = task.id;
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        draggedTaskId = null;
    });

    return card;
}

function handleDragOver(e) {
    e.preventDefault();
}

async function handleDrop(e) {
    e.preventDefault();
    if (!draggedTaskId) return;

    const column = e.currentTarget.closest('.column');
    const newStage = column.dataset.stage;

    const taskCard = document.querySelector(`[data-task-id="${draggedTaskId}"]`);
    const currentStage = taskCard.closest('.column').dataset.stage;

    if (currentStage === newStage) return;

    try {
        const task = await fetchTask(draggedTaskId);
        if (!task) return;

        const res = await fetch(`${API_BASE}/tasks/${draggedTaskId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                title: task.title,
                description: task.description || '',
                stage: newStage
            })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }

        loadTasks();
    } catch (err) {
        console.error('Failed to move task:', err);
        loadTasks();
    }
}

async function fetchTask(id) {
    try {
        const res = await fetch(`${API_BASE}/tasks`, { headers: getAuthHeaders() });
        const tasks = await res.json();
        return tasks.find(t => t.id === id);
    } catch {
        return null;
    }
}

function showAddTaskModal() {
    document.getElementById('modal-title').textContent = 'Add Task';
    document.getElementById('task-id').value = '';
    document.getElementById('task-form').reset();
    document.getElementById('task-stage').value = 'TODO';
    document.getElementById('task-modal').classList.remove('hidden');
}

function editTask(id) {
    const card = document.querySelector(`[data-task-id="${id}"]`);
    const title = card.querySelector('h3').textContent;
    const descEl = card.querySelector('p');
    const description = descEl ? descEl.textContent : '';

    const column = card.closest('.column');
    const stage = column.dataset.stage;

    document.getElementById('modal-title').textContent = 'Edit Task';
    document.getElementById('task-id').value = id;
    document.getElementById('task-title').value = title;
    document.getElementById('task-description').value = description;
    document.getElementById('task-stage').value = stage;
    document.getElementById('task-modal').classList.remove('hidden');
}

async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;

    try {
        const res = await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Delete failed');
        loadTasks();
    } catch (err) {
        console.error('Failed to delete task:', err);
    }
}

async function handleTaskSubmit(e) {
    e.preventDefault();
    const taskId = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const stage = document.getElementById('task-stage').value;
    const errorEl = document.getElementById('task-error');

    const body = { title, description, stage };

    try {
        const url = taskId ? `${API_BASE}/tasks/${taskId}` : `${API_BASE}/tasks`;
        const method = taskId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || 'Failed to save task');
        }

        closeModal('task-modal');
        loadTasks();
    } catch (err) {
        errorEl.textContent = err.message;
    }
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
