var JSONStream = require("JSONStream"); // from https://github.com/dominictarr/JSONStream
var fs = require("fs");
var phantom = require('phantom');

// var http = require("http");
// var https = require("https");
// var Promise = require("es6-promise").Promise;

// var base_url = "http://phishtank-screenshots.e1.usw1.opendns.com.s3-website-us-west-1.amazonaws.com/";

processData(function(error){
    if(error){
        console.log(error);
    } else {
        console.log("DONE");
    }
});


function processData(callback){
    // bad url to test error reporting with:
    // https.get("https://googledrive.com/host/0B9LVk4xbDIJTM1o3NHktMzNQUms/verified_online.json", function(doc) { 
    
    // Google Drive public hosted URL, redirecting asking for auth. Hopefully it heals.
    // https.get("https://f7933a2351a6e0f2cf5207a4efa69188222d09b0.googledrive.com/host/0B9LVk4xbDIJTMGVWc1ROSmFRR3c/wellfargo_phishtank-verified_offline.json", function(doc) {
    
    var readStream = fs.createReadStream("./json/alexa-topsites.json");
    
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
    
    var imageDir = "./images/screenshots/";
    /*http.get(base_url + data.wellsfargo_phishID.text + ".jpg", function(res){
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
    });*/
    
    var website = data.website.text;
    var nmPng = website+".png";
    var nmUrl = "http://www." + website.toLowerCase();
    // http://stackoverflow.com/questions/17189745/phantomjs-take-screenshot-of-a-web-page
    // http://blog.arisetyo.com/?p=463
    var phantom = require('phantom');
    phantom.create("--ignore-ssl-errors=yes", "--ssl-protocol=any", function (ph) {// MAKE SURE WE CAN RENDER https
    	ph.createPage(function (page) {
    		//CREATE PAGE OBJECT
    		page.set('viewportSize', {width:1280,height:900}, function(){
    			page.set('clipRect', {top:0,left:0,width:1280,height:900}, function(){
    				//OPEN PAGE
    				page.open(nmUrl, function(status) {
    					//WAIT 15 SECS FOR WEBPAGE TO BE COMPLETELY LOADED
    					setTimeout(function(){
    						page.render(imageDir+nmPng, function(finished){
    							console.log('rendering '+nmUrl+' done');
    							ph.exit();
    						});							
    					}, 15000);
    				});
    				//END OF: OPEN PAGE
    			});
    		});
    		//END OF: CREATE PAGE OBJECT
    	});
    });

}
