var JSONStream = require("JSONStream"); // from https://github.com/dominictarr/JSONStream
var fs = require("fs");
var http = require("http");
var https = require("https");
var Promise = require("es6-promise").Promise;

var base_url = "http://phishtank-screenshots.e1.usw1.opendns.com.s3-website-us-west-1.amazonaws.com/";

process(function(error){
    if(error){
        console.log(error);
    } else {
        console.log("DONE");
    }
});


function process(callback){
    // bad url to test error reporting with:
    // https.get("https://googledrive.com/host/0B9LVk4xbDIJTM1o3NHktMzNQUms/verified_online.json", function(doc) { 
    // https.get("https://62784695f48bb437b168fc1a3bc9359091fa137c.googledrive.com/host/0B9LVk4xbDIJTWDFjbU5zSW1qZ1k/verified_online.json", function(doc) {
    fs.in(json){   
        /* On Bad Request, check this:
        var body = '';
        doc.on('data', function(chunk){
           body += chunk;
        }).on('end', function(){
            console.log(body);
        });
        */

        doc.on("error", function(error){
            callback(error);
        });
       // Robust Error Handing: 
       // https://strongloop.com/strongblog/robust-node-applications-error-handling/
        doc.pipe(JSONStream.parse("*")).on("data", function(d){
            if(d.target !== "Bank of America Corporation") return;
            processTarget(d, function(error){
                // TODO: handle error
                console.log(error);
            });
        }).on("error",function(error){
            // TODO: handle error
            console.log(error);
        });
    }); // https.get file.json ends
}

var directories = {};
function mkdir(path, callback){
    if (!directories.hasOwnProperty(path)){
        directories[path] = new Promise(function(resolve,reject){
            fs.mkdir(path, function(error){
                if(error){
                    // Treat existing directory as success
                    if(error.code === "EEXIST"){
                        resolve();
                        return;
                    }
                    
                    reject();
                    return;
                }
                
                resolve();
            });
        });
    }

    return directories[path];
}

function processTarget(data, callback){
    var imageDir = "./images/" + data.target.replace(/\s/g, "-");
    mkdir(imageDir)
        .then(function(){
            http.get(base_url + data.phish_id + ".jpg", function(res){
                // https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
                // var ws = fs.createWriteStream("./images/"+d.phish_id + ".jpg");
                // res.saveImage // <-- psuedo 
                // so taking the image buffer (as the response "body") from "res" and running createWriteStream on it basically? 
                // We get a response
                // the body will be the image
                // We create a writestream pointing to a unique filename
                // We pipe all data from the request to the write stream
                
                var writeStream = fs.createWriteStream(imageDir + "/" + data.phish_id + ".jpg");
                writeStream.on("error", function(error){
                    // TODO: handle error
                });
                
                res.on("error", function(error){
                    // TODO: handle error
                });
                
                res.pipe(writeStream);
                writeStream.on("close", callback);
            });
        })
        .catch(callback);
}



/* TO DO */
// stream to Google Drive  with https://github.com/maxogden/google-drive-blobs


/* OLD REFERENCE */
// ref id: 3100851.jpg    
// http://phishtank-screenshots.e1.usw1.opendns.com.s3-website-us-west-1.amazonaws.com/3100851.jpg
// old reference http://danieltao.com/lazy.js/
// old reference http://danieltao.com/lazy.js/demos/json/
// old reference http://danieltao.com/lazy.js/javascripts/demos/json.js