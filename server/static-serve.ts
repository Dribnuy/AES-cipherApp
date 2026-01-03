import path from 'path';
import express from 'express';

/**
 * Sets up static file serving for the Express app
 * @param app 
 */
export function setupStaticServing(app: express.Application) {
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.get('/{*splat}', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });
}
