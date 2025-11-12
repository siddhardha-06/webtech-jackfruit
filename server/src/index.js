import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { router as dsRouter } from './routes/dataStructures.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173'], credentials: false }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/ds', dsRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('Error:', err); // basic logging
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 4000;
// Start server without attempting DB connection so the app works without MongoDB.
app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
