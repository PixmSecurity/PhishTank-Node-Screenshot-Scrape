if(process.send){
    setInterval(process.send.bind(process, 'hi'));
}else{
    var cp = require('child_process');
    cp.fork('./child.js').on('message',console.log.bing(console));
}
