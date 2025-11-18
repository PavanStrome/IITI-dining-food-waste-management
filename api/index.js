import app from '../server/src/app.js';
import { connectToDatabase } from '../server/src/utils/db.js';

// Connect to database when serverless function starts
let dbConnected = false;

async function ensureDbConnection() {
  if (!dbConnected) {
    try {
      await connectToDatabase();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection error:', error);
      dbConnected = false;
    }
  }
}

export default async function handler(req, res) {
  // Ensure database connection
  await ensureDbConnection();
  
  // Handle the request with Express app
  return app(req, res);
}

