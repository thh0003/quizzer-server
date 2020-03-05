

let qqDebug = {};

qqDebug.consoleLogger = function(msg,type=0)
{
//    console.log(`process.env.debug: ${process.env.debug}`);
    const debugMode = (process.env.debug==='true')?true:false;

    if (debugMode){
        if (type===1){
            console.err(msg);
        }else {
            console.log(msg);
        }

    }
};

module.exports = qqDebug;