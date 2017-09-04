const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const http2 = require('http2');
const fs = require('fs');
app.use(serve('.'));

const options = {
	key: fs.readFileSync('authentication/localhost.key'),
	cert: fs.readFileSync('authentication/localhost.crt')
};

//app.listen(3000);
http2.createServer(options,app.callback()).listen(3000);
console.log('UI is running on port 3000!!!');
