var cheerio = Meteor.npmRequire('cheerio');

Meteor.methods({
	test: function() {
		var s = HTTP.get("http://www.ask.com/web?q=lizt");
		var $ = cheerio.load(s.content);
		console.log($('.spell-check-link').text());
	}
});

// Meteor.setInterval(function() {
// 	Meteor.call("test");
// }, 10000);