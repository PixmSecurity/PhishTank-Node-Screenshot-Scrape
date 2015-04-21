var JSONStream = require("JSONStream"); // from https://github.com/dominictarr/JSONStream
var fs = require("fs");
var http = require("http");
var https = require("https");
var Promise = require("es6-promise").Promise;

var base_url = "http://phishtank-screenshots.e1.usw1.opendns.com.s3-website-us-west-1.amazonaws.com/";

processPhishData(function(error){
    if(error){
        console.log(error);
    } else {
        console.log("DONE");
    }
});


function processPhishData(callback){
    // bad url to test error reporting with:
    // https.get("https://googledrive.com/host/0B9LVk4xbDIJTM1o3NHktMzNQUms/verified_online.json", function(doc) { 
    
    // Google Drive public hosted URL, redirecting asking for auth. Hopefully it heals.
    // https.get("https://f7933a2351a6e0f2cf5207a4efa69188222d09b0.googledrive.com/host/0B9LVk4xbDIJTMGVWc1ROSmFRR3c/wellfargo_phishtank-verified_offline.json", function(doc) {
    
    var readStream = fs.createReadStream("./json/wellfargo_phishtank-verified_offline.json");
    
    // how to use the file stream in node:
    // http://ejohn.org/blog/node-js-stream-playground/
    readStream
    .pipe(JSONStream.parse(["results",/^collection/,true])).on("data", function(d){
            // if(d.target !== "Bank of America Corporation") return;
            processTarget(d, function(error){
                // TODO: handle error
                if(error) console.error(error);
            });
        }).on("error",function(error){
            // TODO: handle error
            console.log(error);
        });    
        
        // On Bad Request, check this:
        /*
        var body = '';
        doc.on('data', function(chunk){
           body += chunk;
        }).on('end', function(){
            console.log(body);
        });
        */
        
        // Robust Error Handing: 
        // https://strongloop.com/strongblog/robust-node-applications-error-handling/
        readStream.on("error", function(error){
            callback(error);
        });
}

function processTarget(data, callback){
    
    var imageDir = "./images/wellsfargo-offline";
    http.get(base_url + data.wellsfargo_phishID.text + ".jpg", function(res){
        // https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
        // var ws = fs.createWriteStream("./images/"+d.phish_id + ".jpg");
        // res.saveImage // <-- psuedo 
        // so taking the image buffer (as the response "body") from "res" and running createWriteStream on it basically? 
        // We get a response
        // the body will be the image
        // We create a writestream pointing to a unique filename
        // We pipe all data from the request to the write stream
        
        var writeStream = fs.createWriteStream(imageDir + "/" + data.wellsfargo_phishID.text + ".jpg");
        writeStream.on("error", function(error){
            // TODO: handle error
        });
        
        res.on("error", callback); // TODO: handle error

        res.pipe(writeStream);
        writeStream.on("close", callback);
    });
}



/* TO DO */
// stream to Google Drive  with https://github.com/maxogden/google-drive-blobs


/* OLD REFERENCE */
// ref id: 3100851.jpg    
// http://phishtank-screenshots.e1.usw1.opendns.com.s3-website-us-west-1.amazonaws.com/3100851.jpg
// old reference http://danieltao.com/lazy.js/
// old reference http://danieltao.com/lazy.js/demos/json/
// old reference http://danieltao.com/lazy.js/javascripts/demos/json.js