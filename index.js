const http = require('http');
const net = require('net');
const url = require('url');

const TARGET_HOST = 'takegot.net';
const TARGET_PORT = 80; // Mude para 443 se o painel usar HTTPS na origem

const server = http.createServer((req, res) => {
    const options = {
        hostname: TARGET_HOST,
        port: TARGET_PORT,
        path: req.url,
        method: req.method,
        headers: {
            ...req.headers,
            'Host': TARGET_HOST,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': `http://${TARGET_HOST}/`,
            'X-Forwarded-For': req.socket.remoteAddress
        }
    };

    delete options.headers['cookie']; // Limpa cookies que possam denunciar o proxy

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Erro de ligacao ao servidor de origem.');
    });

    req.pipe(proxyReq, { end: true });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Proxy avancado a correr na porta ${PORT}`);
});
