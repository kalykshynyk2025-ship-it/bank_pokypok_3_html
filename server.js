const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const DB_DIR = path.join(ROOT, 'data');
const DB_FILE = path.join(DB_DIR, 'progress.json');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '{}', 'utf8');

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function sendJson(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function serveStatic(req, res) {
  const reqPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(ROOT, reqPath.replace(/^\/+/, ''));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    const type = ext === '.html' ? 'text/html; charset=utf-8'
      : ext === '.js' ? 'application/javascript; charset=utf-8'
      : ext === '.css' ? 'text/css; charset=utf-8'
      : 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/progress/')) {
    const userId = decodeURIComponent(req.url.split('/').pop());

    if (req.method === 'GET') {
      const db = readDb();
      const payload = db[userId] || { currentLevel: 1, completedLevels: [], submissions: {} };
      sendJson(res, 200, payload);
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const db = readDb();
          db[userId] = {
            currentLevel: Number(parsed.currentLevel) || 1,
            completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
            submissions: parsed.submissions && typeof parsed.submissions === 'object' ? parsed.submissions : {}
          };
          writeDb(db);
          sendJson(res, 200, { ok: true });
        } catch (e) {
          sendJson(res, 400, { error: 'invalid_json' });
        }
      });
      return;
    }

    sendJson(res, 405, { error: 'method_not_allowed' });
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
