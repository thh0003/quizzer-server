const uuidv1 = require('uuid/v1');
const { std, sqrt } = require('mathjs');
const systemLog = require("./sysLog");
const syslog = new systemLog('HelperFunctions');

var helpers = {};
helpers.Unix_timestamp = function(t)
{
    //YYYY-MM-DD HH:mm:SS mysql datetime format
    var a = new Date(t * 1000);
    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();

    var time = year + '-' + month + '-' + ('0'+date).slice(-2);
    return time;
};


helpers.sqlExists = function(psVar, psType){
    if (psVar == null){
        return (psType == 0)? (0) : (' ');
    } else{
        return psVar;
    }
};

helpers.toTimestamp = function(year,month,day,hour=0,minute=0,second=0){
    var datum = new Date(Date.UTC(year,month,day,hour,minute,second));
    return datum.getTime()/1000;
};

helpers.getUUID = () => {
    return uuidv1();
};

helpers.toNearestUTCDay = (t) => {
    return t - t%86400;
}

helpers.getCurrentTS = () => {
    return Math.floor(new Date());
};

helpers.handleException = (fn) => (req, res, next) => {
    fn(req,res).catch((error) => next(error));
};

helpers.fiatRetPrep = (sdiObj) =>{
    return new Array(
        (sdiObj.FER_USD==0)?0:sdiObj.FER_USD/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_GBP/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_KRW/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_RUB/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_CNY/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_JPY/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_EUR/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_BRL/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_INR/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_TRY/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_AUD/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_NZD/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_ETH/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE,
        (sdiObj.FER_USD==0)?0:sdiObj.FER_BTC/sdiObj.FER_USD*sdiObj.SDI_CLOSE_PRICE
    )
}

helpers.statCalc = async (cryptoSDI, stat) => {
    try{
        if (stat == "RETURN"){
            let scrReturns = cryptoSDI.map((symSDI)=>{
                let finalValues = symSDI[symSDI.length-1];
                let initValues = symSDI[0];
                let finalClose = helpers.fiatRetPrep(finalValues);
                let initClose = helpers.fiatRetPrep(initValues);
                let scrR = new Array(symSDI[0].SDI_FSYM_S_ID, symSDI[0].S_SYMBOL, symSDI[0].S_FULLNAME);
                for (let x=0;x<finalClose.length; x++){
                    let ret = (initClose[x]==0)?100:(finalClose[x]-initClose[x])/initClose[x];
                    scrR.push(ret);
                }
                return scrR;
            });
            return scrReturns;
        } else if(stat == "VOLATILITY"){

            let scrReturns = cryptoSDI.map((symSDI)=>{
                let symSDIConv = symSDI.map((SDI) =>{
                    return helpers.fiatRetPrep(SDI);
                });
                let symSDIDailyVol = helpers.Array2D(14,symSDIConv.length);
              
                for (let y=0;y<symSDIConv.length;y++){
                    if (y==0){
                        symSDIDailyVol[0][y] = 0;
                        symSDIDailyVol[1][y] = 0;
                        symSDIDailyVol[2][y] = 0;
                        symSDIDailyVol[3][y] = 0;
                        symSDIDailyVol[4][y] = 0;
                        symSDIDailyVol[5][y] = 0;
                        symSDIDailyVol[6][y] = 0;
                        symSDIDailyVol[7][y] = 0;
                        symSDIDailyVol[8][y] = 0;
                        symSDIDailyVol[9][y] = 0;
                        symSDIDailyVol[10][y] = 0;
                        symSDIDailyVol[11][y] = 0;
                        symSDIDailyVol[12][y] = 0;
                        symSDIDailyVol[13][y] = 0;
                    } else{
                        symSDIDailyVol[0][y] = (symSDIConv[y][0]/symSDIConv[y-1][0])-1;
                        symSDIDailyVol[1][y] = (symSDIConv[y][1]/symSDIConv[y-1][1])-1;
                        symSDIDailyVol[2][y] = (symSDIConv[y][2]/symSDIConv[y-1][2])-1;
                        symSDIDailyVol[3][y] = (symSDIConv[y][3]/symSDIConv[y-1][3])-1;
                        symSDIDailyVol[4][y] = (symSDIConv[y][4]/symSDIConv[y-1][4])-1;
                        symSDIDailyVol[5][y] = (symSDIConv[y][5]/symSDIConv[y-1][5])-1;
                        symSDIDailyVol[6][y] = (symSDIConv[y][6]/symSDIConv[y-1][6])-1;
                        symSDIDailyVol[7][y] = (symSDIConv[y][7]/symSDIConv[y-1][7])-1;
                        symSDIDailyVol[8][y] = (symSDIConv[y][8]/symSDIConv[y-1][8])-1;
                        symSDIDailyVol[9][y] = (symSDIConv[y][9]/symSDIConv[y-1][9])-1;
                        symSDIDailyVol[10][y] = (symSDIConv[y][10]/symSDIConv[y-1][10])-1;
                        symSDIDailyVol[11][y] = (symSDIConv[y][11]/symSDIConv[y-1][11])-1;
                        symSDIDailyVol[12][y] = (symSDIConv[y][12]/symSDIConv[y-1][12])-1;
                        symSDIDailyVol[13][y] = (symSDIConv[y][13]/symSDIConv[y-1][13])-1;
                    }
                }
                
                let scrR = new Array(symSDI[0].SDI_FSYM_S_ID, symSDI[0].S_SYMBOL, symSDI[0].S_FULLNAME);
                for (let x=0;x<symSDIDailyVol.length; x++){
                    let dailyRet = std(symSDIDailyVol[x])*sqrt(365);
//                    console.log(`STD: ${std(symSDIDailyVol[x])} * SQRT(365): ${sqrt(365)} = Volatility: ${dailyRet}`);
                    scrR.push(dailyRet);
                }
                return scrR;
            });
            return scrReturns;            
        }
    } catch (err){
        syslog.writeErrorEntry(`ps-helper-stat.Calc ${err.message}, ${err.stack}`);
        throw new Error(err);
    };  

    
}

helpers.Array2D = (r,c) => [...Array(r)].map(x=>Array(c));

helpers.transposeArray = (array, arrayLength) => {
    var newArray = [];
    for(var i = 0; i < array.length; i++){
        newArray.push([]);
    };

    for(var i = 0; i < array.length; i++){
        for(var j = 0; j < arrayLength; j++){
            newArray[j].push(array[i][j]);
        };
    };

    return newArray;
};

module.exports = helpers;