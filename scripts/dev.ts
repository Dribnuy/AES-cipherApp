import { startServer } from '../server/index.js';
import { createServer } from 'vite';

let viteServer;

async function startDev() {
  await startServer(3001);

  const viteServer = await createServer({
    configFile: './vite.config.js',
  });

  const x = await viteServer.listen();
  console.log(
    `Vite dev server running on port ${viteServer.config.server.port}`,
  );
}

if (
  process.env.npm_lifecycle_event &&
  process.env.npm_lifecycle_event.includes('watch')
) {
  let isRestarting = false;

  process.once('SIGUSR2', async () => {
    if (isRestarting) return;
    isRestarting = true;

    console.log('Nodemon restart detected, closing Vite server...');
    if (viteServer) {
      try {
        await viteServer.close();
        console.log('Vite server closed successfully');
      } catch (err) {
        console.error('Error closing Vite server:', err);
      }
    }

    process.kill(process.pid, 'SIGUSR2');
  });
}

startDev();
