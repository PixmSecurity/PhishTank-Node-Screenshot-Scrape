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
//const TOPSITES = require("./json/alexa-topsites_art-illustration").results.collection1;
const TOPSITES = require("./json/alexa-topsites_shopping-visual-arts").results.collection1;

const DOWNLOAD_DUPLICATE = false;

process.on('uncaughtException', function(err) {
     console.log('Caught exception: ' + err);
});

var limitter = new LimitIt(2);

var _cache = {};
function handleWebsite(isHttps, _url, callback) {
    var url = _url;
    if (/^https?:\/\//.test(_url)) {
        url = _url.toLowerCase();
        _url = _url.replace(/^https?:\/\//, "");
    } else {
        url = "http" + (isHttps ? "s" : "") + "://" +  _url.toLowerCase();    
    }
    
    console.log("Downloading " + url);
    if (_cache[url] && !DOWNLOAD_DUPLICATE) {
        console.log(url + " already downloaded ");
        return callback(null);
    }
    _cache[url] = 0;
    
    var pageres = new Pageres({delay: 2});
    
    var normalizedUrl = _url.replace(/\//, "_");
    var fileName = DOWNLOAD_DUPLICATE ? normalizedUrl + " - " + new Date().getTime() : normalizedUrl;
    
    pageres.src(url, ['1280x900'], {
        crop: true,
        filename: fileName
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
    handleWebsite(false, url, function(err) {
        if (!err) {
            return callback(null); 
        } 
        handleWebsite(true, url, callback);
    });
}

// download(TOPSITES[0].website.text, function (err) {
//     console.log(err || "Downloaded")
// });


var count = TOPSITES.length
  , complete = 0
  ;
  
 
TOPSITES.forEach(function (c) {
    var websiteUrl = typeof c.website === "string" ? c.website : c.website.text;
    limitter.add(download.bind(this, websiteUrl), function (err) {
        console.log("> " + (++complete) + "/" + count);
        if (err) {
            return console.log("!! Url (" + websiteUrl + ") FAILED: ", err);
        }
        console.log("* Downloaded " + websiteUrl)
    });
});