const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const systemLog = require("../class/sysLog");
const qqHelp = require('../class/qq-helper');
const qqDebug = require('../class/debugService');
const userDAO = require('../class/userDAO');
const quizHistoryDAO = require('../class/quizHistoryDAO');
var mySQLPool = require("../class/dbconnpool");

sysLogger = new systemLog("quizzer");
const userDB = new userDAO();
const qqhDB = new quizHistoryDAO();

/* GET users listing. */
router.get('/userLookup/:user', async function(req, res, next) {
    try{
        
        let userLogin = req.params.user;
        qqDebug.consoleLogger(`quizzer->userLookup: user: ${userLogin}`);
        let userInfo = await userDB.lookupUser(userLogin);

        if (typeof userInfo[0]=='undefined'){
            userInfo = await userDB.addUser([userLogin,"USER"]);
            userInfo = await userDB.lookupUser(userLogin);
        }

        res.send(userInfo[0]);

    } catch (err){
        this.sysLogger.writeErrorEntry(`quizzer-userLookup Error: ${err.message} Stack: ${err.stack}`);
        throw new Error(err);
    };

    

});

router.get('/makeAdmin/:user', async function(req, res, next) {
    try{
        
        let userLogin = req.params.user;
        qqDebug.consoleLogger(`quizzer->makeAdmin: user: ${userLogin}`);
        let userInfo = await userDB.lookupUser(userLogin);

        if (typeof userInfo[0]=='undefined'){
            userInfo = await userDB.addUser([userLogin,"ADMIN"]);
            userInfo = await userDB.lookupUser(userLogin);
        } else {
            userInfo = await userDB.updateUser(["ADMIN", userLogin]);
            userInfo = await userDB.lookupUser(userLogin);
        }

        res.send(userInfo[0]);

    } catch (err){
        this.sysLogger.writeErrorEntry(`quizzer-makeAdmin Error: ${err.message} Stack: ${err.stack}`);
        throw new Error(err);
    };

});

router.get('/deleteUser/:user', async function(req, res, next) {
    try{
        
        let userLogin = req.params.user;
        let retValue = false;
        qqDebug.consoleLogger(`quizzer->deleteUser: user: ${userLogin}`);
        let userInfo = await userDB.deleteUser(userLogin);
        if (userInfo)
            retValue = true;
        res.send({deleted:retValue});

    } catch (err){
        this.sysLogger.writeErrorEntry(`quizzer-deleteUser Error: ${err.message} Stack: ${err.stack}`);
        throw new Error(err);
    };

});

router.post('/addQuizHistory/', async function(req, res, next) {
    try {
        let quizInfo = req.body;
        let userLogin = quizInfo.user;
        let userInfo = await userDB.lookupUser(userLogin);
        qqDebug.consoleLogger(`quizzer->addQuizHistory: ${userLogin}`);
        qqDebug.consoleLogger(req.body);
        if (typeof userInfo[0]=='undefined'){
            userInfo = await userDB.addUser([userLogin,"USER"]);
            userInfo = await userDB.lookupUser(userLogin);
        }
        qqDebug.consoleLogger(userInfo);
        //`QQH_GUI`, `QQH_OS`, `QQH_ASKED`, `QQH_CORRECT`, `QQH_DURATION`, `QQH_START_TS`, `QQH_QUIZ_FILE`, `QQH_QU_ID`
        res.send(await qqhDB.addQH([
            quizInfo.QQH_GUI,
            quizInfo.QQH_OS,
            quizInfo.QQH_ASKED,
            quizInfo.QQH_CORRECT,
            quizInfo.QQH_DURATION,
            quizInfo.QQH_START_TS,
            quizInfo.QQH_QUIZ_FILE,
            userInfo[0].QU_ID
        ]));

    } catch (err){
        this.sysLogger.writeErrorEntry(`quizzer-addQuizHistory Error: ${err.message} Stack: ${err.stack}`);
        throw new Error(err);
    };
    
});

router.get('/QHlookup/:user', async function(req, res, next) {
    try{
        
        let userLogin = req.params.user;
        qqDebug.consoleLogger(`quizzer->QHLookup: user: ${userLogin}`);
        let userInfo = await userDB.lookupUser(userLogin);

        if (typeof userInfo[0]=='undefined'){
            userInfo = await userDB.addUser([userLogin,"USER"]);
            userInfo = await userDB.lookupUser(userLogin);
        }
        qqDebug.consoleLogger(userInfo);
        let userQH = await qqhDB.lookupQH(userInfo[0].QU_ID);

        res.send(userQH);

    } catch (err){
        this.sysLogger.writeErrorEntry(`quizzer-QHlookup Error: ${err.message} Stack: ${err.stack}`);
        throw new Error(err);
    };
});

router.get('/QHlookupAll/:user', async function(req, res, next) {
    try{
        
        let userLogin = req.params.user;
        qqDebug.consoleLogger(`quizzer->QHLookup: user: ${userLogin}`);
        let userInfo = await userDB.lookupUser(userLogin);
        let userQH;
        if (typeof userInfo[0]!='undefined'){
            if (userInfo[0].QU_ROLE == 'ADMIN'){
                qqDebug.consoleLogger(userInfo);
                userQH = await qqhDB.lookupAll();
            } else {
                res.send({error:"User doesn't have permission to view all Quiz History"});
                throw new Error("User doesn't have permission to view all Quiz History");
            }
        }

        res.send(userQH);

    } catch (err){
        this.sysLogger.writeErrorEntry(`quizzer-QHlookup Error: ${err.message} Stack: ${err.stack}`);
        throw new Error(err);
    };
});

module.exports = router;