require('dotenv').config();
const express = require('express');
const cors = require('cors');

const startupsRouter = require('./routes/startups');
const foundersRouter = require('./routes/founders');
const uploadRouter = require('./routes/upload');

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/startups', startupsRouter);
app.use('/api/founders', foundersRouter);
app.use('/api/upload', uploadRouter);

app.use((err, _req, res, _next) => {
  console.error('[server error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`IA investors API listening on http://localhost:${port}`);
  console.log(`CORS origin: ${clientOrigin}`);
});
