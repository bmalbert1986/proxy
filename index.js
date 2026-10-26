const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    xfwd: true
});

const server = http.createServer((req, res) => {
    // Força cabeçalhos para parecer um navegador real e evitar o bloqueio da Cloudflare
    req.headers['Host'] = 'takegot.net';
    req.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    req.headers['Referer'] = 'http://takegot.net/';

    proxy.web(req, res, { 
        target: 'http://takegot.net'
    }, (err) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro no proxy reverso.');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Proxy ativo na porta ${PORT}`);
});
