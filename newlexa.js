var Nightmare = require('nightmare');
var alexaJsonObj = require("./json/alexa-topsites.json");
var async = require('async');
var vo = require('vo'); // https://github.com/segmentio/nightmare#execution

// Example of how to navigate json object:
// console.log(alexaJsonObj.results.collection1[0].website.text);

// https://www.codementor.io/nodejs/tutorial/how-to-use-json-files-in-node-js
//var exjson = {'key':'...abc...', 'key2':'...xyz...'};
//console.log("key:"+exKey+", value:"+exjson[exKey]);

/*var exjson = {'key':'...abc...', 'key2':'...xyz...'};
for(var exKey in exjson) {
      console.log("key:"+exKey+", value:"+exjson[exKey]);
 }*/

var array = alexaJsonObj.results.collection1;
var imageDir = "./images/alexa-topsites-screenshots/";
var exWebsite; 

for(i = 0; exWebsite in alexaJsonObj; i++){
    var google = new Nightmare()
      .goto('http://google.com')
      .wait()
      .screenshot('google.png')
      .run(function(err, nightmare) {
        if (err) return console.log(err);
        console.log('Done!');
      });
    }