const API = 'http://localhost:5000';
const socket = io(API);
let currentProject = null;

async function loadProjects() {
  const res = await fetch(API + '/projects');
  const projects = await res.json();
  const list = document.getElementById('projects');
  list.innerHTML = '';
  projects.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.name;
    li.onclick = () => { currentProject = p.id; loadTasks(); };
    list.appendChild(li);
  });
}

async function loadTasks() {
  const res = await fetch(API + '/tasks'); // optional: filter in backend
  const tasks = await res.json();
  const list = document.getElementById('tasks');
  list.innerHTML = '';
  tasks.filter(t => t.projectId === currentProject).forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.title} [${t.status}]`;
    list.appendChild(li);
  });
}

async function addProject() {
  const name = document.getElementById('projectName').value;
  await fetch(API + '/projects', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name})});
}

async function addTask() {
  if(!currentProject) return alert('Select project first');
  const title = document.getElementById('taskTitle').value;
  await fetch(API + '/tasks', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({projectId: currentProject, title})});
}

socket.on('project:new', loadProjects);
socket.on('task:new', loadTasks);

loadProjects();
