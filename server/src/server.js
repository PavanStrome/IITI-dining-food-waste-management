import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import { connectToDatabase } from './utils/db.js';

const port = process.env.PORT || 4000;

async function start() {
  await connectToDatabase();
  const server = http.createServer(app);
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});


