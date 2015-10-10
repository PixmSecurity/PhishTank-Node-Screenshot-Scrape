// Copyright Jonas Genannt <jonas@brachium-system.net>
// Licensed under the Apache License, Version 2.0

var page = new WebPage();
var fs   = require('fs');
page.viewportSize = { width: 1600, height: 1200 };

/*if (phantom.args.length === 0) {
	console.log('Usage: screenshot.js <some JSON>');
	phantom.exit();
}*/

try {
	f = fs.read('./json/alexa-topsites.json');

} catch (e) {
	console.log(e);
}

var array = alexaJsonObj.results.collection1;
var imageDir = "./images/screenshots/";

for (index = 0; index < array.length; ++index) {
  var website = alexaJsonObj.results.collection1[index].website.text;
  var nmPng = website+".png";
  var nmUrl = "http://www." + website.toLowerCase();
  // http://stackoverflow.com/questions/17189745/phantomjs-take-screenshot-of-a-web-page
  var WebPage = require('webpage');
  page = WebPage.create();
  page.open(nmUrl);
  page.onLoadFinished = function() {
     page.render(imageDir+nmPng);
     phantom.exit();
  };

var screenshot = JSON.parse(f);
console.log(f);
//var view_port  = screenshot.ViewPort.split(/x/);
//var userAgent = screenshot.UserAgent;
/*if (userAgent && userAgent !== "") {
	page.settings.userAgent = userAgent;
} else {
	page.settings.userAgent = 'HggH PhantomJS Screenshoter';
}*/
// page.viewportSize = { width: view_port[0], height: view_port[1] };

page.onLoadFinished = function (status) {
	if (status !== 'success') {
		phantom.exit(1);
	}
	page.render(screenshot.Output);
	phantom.exit();
}

page.open(screenshot.Url);