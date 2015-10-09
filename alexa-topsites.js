var Nightmare = require('nightmare');
var alexaJsonObj = require("./json/alexa-topsites.json");
var async = require('async');
var vo = require('vo'); // https://github.com/segmentio/nightmare#execution

// Example of how to navigate json object:
// console.log(alexaJsonObj.results.collection1[0].website.text);

// https://www.codementor.io/nodejs/tutorial/how-to-use-json-files-in-node-js
//var exjson = {'key':'...abc...', 'key2':'...xyz...'};
//console.log("key:"+exKey+", value:"+exjson[exKey]);

var array = alexaJsonObj.results.collection1;
var imageDir = "./images/alexa-topsites-screenshots/";
// process.setMaxListeners(0); // http://stackoverflow.com/questions/9768444/possible-eventemitter-memory-leak-detected

// https://github.com/segmentio/nightmare#examples
var website = array[0].website;
console.log(website);
var nmUrl = "http://www." + website.text.toLowerCase();
var nmPng = website.text+".png";
var nightmare = Nightmare({ show: true });
console.log('have nightmare');
nightmare
  .goto(nmUrl)
  .wait(50)
  .screenshot(imageDir+nmPng)
  .end()
  .then(function(){
    console.log('no problem');
  }, function(){
    console.log('error');
  });

nightmare.proc.on('close', function(){
  console.log('close', arguments);
})

nightmare.proc.on('message', function(){
  console.log('message', arguments);
})



// REFERENCE
// http://phantomjs.org/quick-start.html
/*var page = require('webpage').create();
page.open('http://example.com', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('example.png');
  }
  phantom.exit();
});*/
    