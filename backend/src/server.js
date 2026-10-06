const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

const server = app.listen(env.port, () => {
  logger.info(`API ready on http://localhost:${env.port}/api (${env.nodeEnv})`);
});

function shutdown(signal) {
  logger.warn(`${signal} received, shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
}

['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason);
});

module.exports = server;
