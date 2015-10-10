//
//{
//  "name": "Alexa TopSites",
//  "count": 625,
//  "frequency": "Manual Crawl",
//  "version": 2,
//  "newdata": false,
//  "lastrunstatus": "success",
//  "thisversionstatus": "success",
//  "thisversionrun": "Thu Oct 08 2015 06:57:02 GMT+0000 (UTC)",
//  "results": {
//    "collection1": [
//      {
//        "website": {
//          "href": "http:\/\/www.alexa.com\/siteinfo\/google.com",
//          "text": "Google.com"
//        },
//        "index": 1,
//        "url": "http:\/\/www.alexa.com\/topsites"
//      },
//    ]
//  }
//}

// Example of how to navigate json object:
// console.log(alexaJsonObj.results.collection1[0].website.text);

// Dependencies
var Pageres = require('pageres');
var LimitIt = require("limit-it");

// Constants
const DESTINATION_DIR = "./images/screenshots/";
const TOPSITES = require("./json/alexa-top1000_2013").results.collection1;
const DOWNLOAD_DUPLICATE = false;

process.on('uncaughtException', function(err) {
     console.log('Caught exception: ' + err);
});

var limitter = new LimitIt(2);

var _cache = {};
function handleWebsite(/*isHttps,*/ _url, callback) {
    var url = /*"http" + (isHttps ? "s" : "") + "://" + */ _url.toLowerCase();
    console.log("Downloading " + url);
    if (_cache[url] && !DOWNLOAD_DUPLICATE) {
        console.log(url + " already downloaded ");
        return callback(null);
    }
    _cache[url] = 0;
    var pageres = new Pageres({delay: 2});
    pageres.src(url, ['1280x900'], {
        crop: true,
        filename: DOWNLOAD_DUPLICATE ? _url + " - " + new Date().getTime() : undefined
    });
    
    pageres.on('error', function (err) {
        console.log("Error: ", err);
        callback(err);
    });
    
    //pageres.on('warn', function (warn) {
    //   console.log("Warn (" + url + "):", warn);
    //});
    
    pageres.dest(DESTINATION_DIR);
    pageres.run(function (err) {
        callback(err, "Success")
    });
}

function download(url, callback) {
    handleWebsite(/*false,*/ url, function(err) {
        if (!err) {
            return callback(null); 
        } 
        handleWebsite(/*true,*/ url, callback);
    });
}

// download(TOPSITES[0].website.text, function (err) {
//     console.log(err || "Downloaded")
// });


var count = TOPSITES.length
  , complete = 0
  ;
 
TOPSITES.forEach(function (c) {
    limitter.add(download.bind(this, c.website), function (err) {
        console.log("> " + (++complete) + "/" + count);
        if (err) {
            return console.log("!! Url (" + c.website + ") FAILED: ", err);
        }
        console.log("* Downloaded " + c.website)
    });
});