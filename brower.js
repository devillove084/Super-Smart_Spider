var casper = require('casper').create({
	clientScripts: ["jquery-3.2.1.min.js"]
})

casper.start('https://www.baidu.com/',function(){
	this.echo(this.getTitle())		
})

casper.then(function(){
	this.capture('baidu-homepage.png')
})

casper.then(function(){
	this.fill('form[action="/s"]',{wd: 'thoughtworks' }, true)

})

casper.then(function(){
	search_result_titles = this.evaluate(getTitles)
	this.echo(search_result_titles.join('\n'))
})

casper.then(function(){
	this.capture('dmc-search-result.png')
})

function getTitles(){
	var titles = $.map($("h3.t a"),function(link){
		return $(link).text()
	})
	return titles
}

casper.run()
