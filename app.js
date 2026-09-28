import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dir = path.dirname(__filename);

const logFile = path.join(__dir, 'debug.log');
function log(msg) {
  const line = '[' + new Date().toISOString() + '] ' + msg + '\n';
  try { fs.appendFileSync(logFile, line); } catch (e) {}
  console.log(msg);
}

log('app.js starting - Node ' + process.version);
log('NODE_ENV: ' + (process.env.NODE_ENV || 'not set'));

process.env.NODE_ENV = 'production';

const app = next({ dev: false, dir: __dir });
const handle = app.getRequestHandler();

app.prepare().then(function () {
  const bindTarget = process.env.PORT || 3000;
  log('Binding to: ' + bindTarget);

  createServer(function (req, res) {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(bindTarget, function () {
    log('Next.js production server ready on ' + bindTarget);
  });

}).catch(function (err) {
  log('FATAL BOOT ERROR: ' + (err.stack || err.message));
  throw err;
});
