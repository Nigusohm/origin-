'use strict';

const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

const __dir = __dirname;

const logFile = path.join(__dir, 'debug.log');
function log(msg) {
  const line = '[' + new Date().toISOString() + '] ' + msg + '\n';
  try { fs.appendFileSync(logFile, line); } catch (e) {}
  console.log(msg);
}

log('app.js starting - Node ' + process.version);
log('NODE_ENV: ' + (process.env.NODE_ENV || 'not set'));

process.env.NODE_ENV = 'production';

// Dynamically import next (ESM package) from CommonJS
async function main() {
  let next;
  try {
    next = (await import('next')).default;
  } catch (e) {
    log('Failed to import next: ' + (e.stack || e.message));
    process.exit(1);
  }

  const app = next({ dev: false, dir: __dir });
  const handle = app.getRequestHandler();

  try {
    await app.prepare();
  } catch (err) {
    log('FATAL: app.prepare() failed: ' + (err.stack || err.message));
    process.exit(1);
  }

  const bindTarget = process.env.PORT || 3000;
  log('Binding to: ' + bindTarget);

  createServer(function (req, res) {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(bindTarget, function () {
    log('Next.js production server ready on port ' + bindTarget);
  });
}

main().catch(function (err) {
  const line = '[' + new Date().toISOString() + '] FATAL BOOT ERROR: ' + (err.stack || err.message) + '\n';
  try { fs.appendFileSync(logFile, line); } catch (e) {}
  console.error('FATAL BOOT ERROR:', err);
  process.exit(1);
});
