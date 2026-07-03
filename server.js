
const dns = require('dns');
// Set DNS servers if the local resolver is 127.0.0.1/localhost to avoid querySrv ECONNREFUSED on Windows
if (dns.getServers().includes('127.0.0.1') || dns.getServers().includes('::1') || dns.getServers().length === 0) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}
const http = require('http')
const app = require('./app')


const server = http.createServer(app)



server.listen(3000,()=>{
    console.log("app chal raha hai.......")
})