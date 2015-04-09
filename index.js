var JSONStream = require("JSONStream");
var fs = require("fs");
var http = require("http");
var https = require("https");

//var js = JSONStream.parse("*"); // from https://github.com/dominictarr/JSONStream
var base_url = "http://phishtank-screenshots.e1.usw1.opendns.com.s3-website-us-west-1.amazonaws.com/";


https.get("https://709835a729905aaedbb46e58484b1475f3ccff31.googledrive.com/host/0B9LVk4xbDIJTU0d4T2ZUR2swSmc/verified_online.json", function(doc) {
    // ehhhyy... ;)   
    doc.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    }).pipe(JSONStream.parse("*")).on("data",function(d){
        if(d.target !== "PayPal") return;
        http.get(base_url + d.phish_id + ".jpg", function(res){
            // https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
//            var ws = fs.createWriteStream("./images/"+d.phish_id + ".jpg");
            // res.saveImage // <-- psuedo 
            // so taking the image buffer (as the response "body") from "res" and running createWriteStream on it basically? 
            // We get a response
            // the body will be the image
            // We create a writestream pointing to a unique filename
            // We pipe all data from the request to the write stream
            res.pipe(fs.createWriteStream("./images/"+d.phish_id + ".jpg"));
        });
    })
    
}); 



// ref id: 3100851.jpg    
// http://phishtank-screenshots.e1.usw1.opendns.com.s3-website-us-west-1.amazonaws.com/3100851.jpg
// old reference http://danieltao.com/lazy.js/
// old reference http://danieltao.com/lazy.js/demos/json/
// old reference http://danieltao.com/lazy.js/javascripts/demos/json.js