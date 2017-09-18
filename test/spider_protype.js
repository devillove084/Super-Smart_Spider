const http2 = require('http2');
const fs = require('fs');


const options = {
	key: fs.readFileSync('authentication/server.key'),
	cert: fs.readFileSync('authentication/server.crt')
};
http2.get('https://music.douban.com/review/latest/',(res) => {
	//console.log('StatusCode:',res.statusCode);
	//console.log('Headers:',res.headers);

	//console.log(res);
	res.on('data',(d) => {
		process.stdout.write(d);
		//console.log(d)
	});
}).on('error',(e) => {
	console.error(e);
});
http2.createServer(options,(req,res) => {
	res.writeHead(200);
	res.end('hello world\n');
}).listen(3000);
console.log('Running on port 3000!!!');
