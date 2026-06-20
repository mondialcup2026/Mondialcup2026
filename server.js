const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BOT_TOKEN = '8191936030:AAFl4PoBphmVzsukVH1Y-SP5mE45kgMqnkg';
const CHAT_ID = '8278195073';

http.createServer((req, res) => {
    // Route: إرسال للتليغرام
    if (req.url === '/send' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { message } = JSON.parse(body);
                const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
                
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown'
                    })
                })
                .then(r => r.json())
                .then(data => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data));
                })
                .catch(err => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // Route: الصفحة الرئيسية
    let filePath = path.join(__dirname, 'index.html');
    if (req.url !== '/') {
        filePath = path.join(__dirname, req.url);
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.ico': 'image/x-icon'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        res.end(data);
    });

}).listen(PORT, () => {
    console.log(`[+] Server running at http://localhost:${PORT}`);
});
