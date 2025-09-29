
import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { encryptionRouter } from './encryption.router.js';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const tempDir = path.join(process.cwd(), 'data', 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}


// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve encrypted files statically
app.use('/api/downloads', express.static(uploadsDir));

// Encryption routes
app.use('/api', encryptionRouter);

// Export a function to start the server
export async function startServer(port: number) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url.endsWith(process.argv[1])) {
  console.log('Starting server...');
  startServer(Number(process.env.PORT) || 3001);
}
