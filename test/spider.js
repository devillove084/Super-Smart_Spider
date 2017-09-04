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
			let a = $('.yq-main').children().prev().html();
			let b = $(a).children().prevAll().html();
			console.log(b);
		}
		done();
	}
});

c.queue('https://yq.aliyun.com/articles/type_all?spm=5176.100239.bloglist.4.FSyfaX');
