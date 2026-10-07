const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const root = __dirname;
const DATA_FILE = path.join(root, 'data.json');
const ADMIN_PIN = '20101123';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4'
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Pin');
}

const server = http.createServer((req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, 'http://localhost:4173');
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // API: Get saved data
  if (pathname === '/api/data' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return res.end(raw);
      } catch (e) {
        return res.end(JSON.stringify({ texts: {}, stickers: {} }));
      }
    }
    return res.end(JSON.stringify({ texts: {}, stickers: {} }));
  }

  // API: Save edits
  if (pathname === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const pin = data.pin || req.headers['x-admin-pin'];
        if (pin !== ADMIN_PIN) {
          res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'رمز التعديل غير صحيح!' }));
        }

        const payload = {
          texts: data.texts || {},
          stickers: data.stickers || {},
          lastUpdated: new Date().toISOString()
        };

        fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'تم حفظ التعديلات بنجاح في السيرفر' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'خطأ في قراءة البيانات المرسلة' }));
      }
    });
    return;
  }

  // API: Reset edits
  if (pathname === '/api/reset' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const pin = data.pin || req.headers['x-admin-pin'];
        if (pin !== ADMIN_PIN) {
          res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ error: 'رمز التعديل غير صحيح!' }));
        }

        if (fs.existsSync(DATA_FILE)) {
          fs.unlinkSync(DATA_FILE);
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'تمت استعادة البيانات الأصلية' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'خطأ أثناء إعادة الضبط' }));
      }
    });
    return;
  }

  // Serve static files
  const file = path.resolve(root, pathname === '/' ? 'index.html' : '.' + pathname);
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500);
      return res.end(error.code === 'ENOENT' ? '404 Not Found' : 'Server Error');
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'Content-Type': types[ext] || 'application/octet-stream'
    });
    res.end(data);
  });
});

const PORT = 4173;
server.listen(PORT, '0.0.0.0', () => {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
        ips.push(net.address);
      }
    }
  }

  console.log('----------------------------------------------------');
  console.log('🎀 موقع هدية فرح يعمل بنجاح!');
  console.log(`💻 من نفس الكمبيوتر:  http://localhost:${PORT}`);
  ips.forEach(ip => {
    console.log(`📱 من الجوال (على نفس الواي فاي): http://${ip}:${PORT}`);
  });
  console.log(`🔒 رمز وضع التعديل: ${ADMIN_PIN}`);
  console.log('----------------------------------------------------');
});
