const http2 = require('http2');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');

const options = {
	key: fs.readFileSync('authentication/server.key'),
	cert: fs.readFileSync('authentication/server.crt')
};

const url = 'https://music.douban.com/review/latest/'

function getInfo(url){
	request(url,function(err,res,body){
		if (err) console.log(err);
		var obj = cheerio.load(body);
		console.log(obj); //Must parse html over here!!!
	});
}




getInfo(url);


http2.createServer(options,(req,res) => {
	res.writeHead(200);
	res.end('hello world\n');
}).listen(3000);

console.log('Running on port 3000!!!');
