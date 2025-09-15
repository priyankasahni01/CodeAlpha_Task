import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import db from './models.js';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// === REST API ===
app.get('/projects', (_, res) => {
  const projects = db.prepare('SELECT * FROM projects').all();
  res.json(projects);
});

app.post('/projects', (req, res) => {
  const { name } = req.body;
  const info = db.prepare('INSERT INTO projects(name) VALUES (?)').run(name);
  io.emit('project:new', { id: info.lastInsertRowid, name });
  res.json({ id: info.lastInsertRowid, name });
});

app.post('/tasks', (req, res) => {
  const { projectId, title } = req.body;
  const info = db.prepare('INSERT INTO tasks(projectId, title, status) VALUES (?, ?, ?)')
                 .run(projectId, title, 'todo');
  io.emit('task:new', { id: info.lastInsertRowid, projectId, title, status: 'todo' });
  res.json({ id: info.lastInsertRowid, projectId, title, status: 'todo' });
});

app.post('/comments', (req, res) => {
  const { taskId, text } = req.body;
  const info = db.prepare('INSERT INTO comments(taskId, text) VALUES (?, ?)').run(taskId, text);
  io.emit('comment:new', { id: info.lastInsertRowid, taskId, text });
  res.json({ id: info.lastInsertRowid, taskId, text });
});

// Start
httpServer.listen(5000, () => console.log('Backend running on http://localhost:5000'));
