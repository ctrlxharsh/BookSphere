import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginHandler from './api/login.js';
import booksHandler from './api/books.js';
import aiHandler from './api/ai.js';
import usersHandler from './api/users.js';
import studentHandler from './api/student.js';
import statsHandler from './api/stats.js';
import researchHandler from './api/research.js';
import requestsHandler from './api/requests.js';
import reportsHandler from './api/reports.js';
import publicStatsHandler from './api/public-stats.js';
import renewHandler from './api/renew.js';
import activitiesHandler from './api/activities.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Mock Vercel response object for local express
const wrapHandler = (handler) => async (req, res) => {
  console.log(`Body: ${JSON.stringify(req.body)}`);
  const vercelRes = {
    status: (code) => {
      res.status(code);
      return vercelRes;
    },
    json: (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(data);
    },
    setHeader: (name, value) => res.setHeader(name, value),
    send: (data) => res.send(data),
  };
  try {
    await handler(req, vercelRes);
  } catch (err) {
    console.error('Handler Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

app.post('/api/login', wrapHandler(loginHandler));
app.get('/api/books', wrapHandler(booksHandler));
app.post('/api/books', wrapHandler(booksHandler));
app.post('/api/ai', wrapHandler(aiHandler));
app.get('/api/users', wrapHandler(usersHandler));
app.post('/api/users', wrapHandler(usersHandler));
app.get('/api/student/issued', wrapHandler(studentHandler));
app.get('/api/student/saved', wrapHandler(studentHandler));
app.get('/api/student/history', wrapHandler(studentHandler));
app.post('/api/student/save', wrapHandler(studentHandler));
app.get('/api/requests', wrapHandler(requestsHandler));
app.post('/api/requests', wrapHandler(requestsHandler));
app.put('/api/requests', wrapHandler(requestsHandler));
app.get('/api/reports', wrapHandler(reportsHandler));
app.put('/api/books', wrapHandler(booksHandler));
app.delete('/api/books', wrapHandler(booksHandler));
app.get('/api/books/categories', wrapHandler(booksHandler));
app.get('/api/public-stats', wrapHandler(publicStatsHandler));
app.post('/api/renew', wrapHandler(renewHandler));
app.all('/api/stats', (req, res) => statsHandler(req, res));
app.all('/api/research', (req, res) => researchHandler(req, res));
app.get('/api/activities', wrapHandler(activitiesHandler));
app.post('/api/activities', wrapHandler(activitiesHandler));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`API Server running on http://127.0.0.1:${PORT}`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill the process using it.`);
  } else {
    console.error(e);
  }
  process.exit(1);
});

// Keep process alive
setInterval(() => {}, 1000);
