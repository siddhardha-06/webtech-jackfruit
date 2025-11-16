import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { router as dsRouter } from './routes/dataStructures.js';

dotenv.config();

const app = express();
app.use(helmet());
// Allow any origin in development to avoid "Failed to fetch" when opening HTML directly or using alternate localhost ports.
app.use(
  cors({
    origin: (origin, cb) => {
      if (process.env.NODE_ENV !== 'production') return cb(null, true);
      const allow = ['http://localhost:5173'];
      if (!origin || allow.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: false
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/ds', dsRouter);

// DB status endpoint to aid debugging
app.get('/api/db-status', (_req, res) => {
  const state = mongoose.connection?.readyState ?? 0;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting', 'unauthorized', 'unknown'];
  res.json({
    uri: (process.env.MONGODB_URI || 'mongodb://localhost:27017/structify').replace(/:\/\/([^:]+):[^@]+@/, '://$1:****@'),
    state,
    stateText: states[state] || 'unknown',
    name: mongoose.connection?.name,
    host: mongoose.connection?.host,
    port: mongoose.connection?.port
  });
});

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

const PORT = Number(process.env.PORT || 4000);
// Attempt MongoDB connection on startup; continue serving even if it fails.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/structify';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err?.message || err);
    console.error('API will continue using seed JSON data.');
  }
}

mongoose.connection.on('error', (e) => {
  console.error('MongoDB connection error:', e?.message || e);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

connectDB();

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server listening on ${HOST}:${PORT}`));
