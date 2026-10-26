const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    proxy.web(req, res, { 
        target: 'http://takegot.net',
        changeOrigin: true,
        headers: {
            'Host': 'takegot.net'
        }
    }, (err) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro no proxy reverso.');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Proxy ativo na porta ${PORT}`);
});
