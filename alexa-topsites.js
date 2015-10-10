var alexaJsonObj = require("./json/alexa-topsites.json");

// Example of how to navigate json object:
// console.log(alexaJsonObj.results.collection1[0].website.text);

// https://www.codementor.io/nodejs/tutorial/how-to-use-json-files-in-node-js
//var exjson = {'key':'...abc...', 'key2':'...xyz...'};
//console.log("key:"+exKey+", value:"+exjson[exKey]);
/*
var exjson = {'key':'...abc...', 'key2':'...xyz...'};
for(var exKey in exjson) {
      console.log("key:"+exKey+", value:"+exjson[exKey]);
 }*/

var array = alexaJsonObj.results.collection1;
var imageDir = "./images/screenshots/";


/*var index;
var a = ["a", "b", "c"];
for (index = 0; index < a.length; ++index) {
    console.log(a[index]);
}*/

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
}


