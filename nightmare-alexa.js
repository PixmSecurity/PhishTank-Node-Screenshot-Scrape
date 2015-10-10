var Nightmare = require('nightmare');

var google = new Nightmare()
  .goto('http://google.com')
  .wait()
  .run(function(err, nightmare) {
    if (err) return console.log(err);
    console.log('Done!');
  });