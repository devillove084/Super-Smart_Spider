const Crawler = require('crawler');
const cheerio = require('cheerio');

const c = new Crawler({
	maxConnections : 10,
	callback : function(error,res,done){
		if (error){
			console.log(error);
		}else{
			let $ = cheerio.load(res.body)
			//console.log($('div').find('class').find());
			let a = $('.yq-main');
			console.log(a);
			//.children().prev().html();
			//let b = $(a).children().prevAll();
			//console.log(b[0]);
			//let num = b.length;
			//console.log(num);
			//for (let i = 0;i< num ;i++){
			//	let p = b[i].attribs;
			//	console.log(p);
			//}
		}
		done();
	}
});

c.queue('https://yq.aliyun.com/articles/type_all?spm=5176.100239.bloglist.4.FSyfaX');


