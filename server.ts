import 'dotenv/config';
import app from './app.js';

process.on('uncaughtException', (err) => {
  process.exit(1);
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {});

process.on('unhandledRejection', (err: Error) => {
  server.close(() => {
    process.exit(1);
  });
});
