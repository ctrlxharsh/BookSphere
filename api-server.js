import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handler as loginHandler } from './api/login.js';
import { handler as booksHandler } from './api/books.js';
import { handler as aiHandler } from './api/ai.js';
import { handler as usersHandler } from './api/users.js';
import { handler as studentHandler } from './api/student.js';
import { handler as statsHandler } from './api/stats.js';
import { handler as researchHandler } from './api/research.js';
import { handler as requestsHandler } from './api/requests.js';
import { handler as reportsHandler } from './api/reports.js';
import { handler as publicStatsHandler } from './api/public-stats.js';
import { handler as renewHandler } from './api/renew.js';
import { handler as activitiesHandler } from './api/activities.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Mock Netlify event object for local express
const wrapHandler = (handler) => async (req, res) => {
  const event = {
    httpMethod: req.method,
    path: req.path,
    queryStringParameters: req.query,
    body: req.body ? JSON.stringify(req.body) : null,
    headers: req.headers,
  };

  try {
    const result = await handler(event, {});
    
    // Set headers
    if (result.headers) {
      Object.entries(result.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
    }

    res.status(result.statusCode || 200);
    
    if (result.body) {
      try {
        res.json(JSON.parse(result.body));
      } catch (e) {
        res.send(result.body);
      }
    } else {
      res.end();
    }
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
app.all('/api/stats', wrapHandler(statsHandler));
app.all('/api/research', wrapHandler(researchHandler));
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
