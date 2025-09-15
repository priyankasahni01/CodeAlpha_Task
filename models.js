import Database from 'better-sqlite3';
const db = new Database('data.db');

// Create tables
db.prepare(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT)`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS projects(id INTEGER PRIMARY KEY, name TEXT)`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, projectId INT, title TEXT, status TEXT)`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS comments(id INTEGER PRIMARY KEY, taskId INT, text TEXT)`).run();

export default db;
