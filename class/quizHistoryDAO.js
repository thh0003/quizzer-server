const request = require("request");
const rp = require("request-promise");
const DB = require('./database');
const qqDebug = require('../class/debugService');
const dbHelp = require('./dbHelper');
const systemLog = require("./sysLog");

class quizHistoryDAO {
    constructor() {
        this.exDB = new DB();
        this.sysLogger = new systemLog("quizHistoryDAO");
    }

    async addQH(exValues){
        qqDebug.consoleLogger(`quizHistoryDAO->addQH: `);
        try{
            var qqData = await dbHelp.withTransaction(this.exDB, async () => {
                var addSQL = "INSERT INTO `Q_QUIZ_HISTORY` (`QQH_GUI`, `QQH_OS`, `QQH_ASKED`, `QQH_CORRECT`, `QQH_DURATION`, `QQH_START_TS`, `QQH_QUIZ_FILE`, `QQH_QU_ID` )"+
                             " VALUES (?,?,?,?,?,?,?,?)";
                this.sysLogger.writeLogEntry("Adding quizHistory: "+addSQL);
                qqDebug.consoleLogger(addSQL);
                qqDebug.consoleLogger(exValues);
                return await this.exDB.runQuery(addSQL, exValues);
            });
            return qqData[0];
        } catch(err) {
            // API call failed...
            this.sysLogger.writeLogEntry(`quizHistoryDAO-addQH ${err.message}, ${err.stack}`);
            throw new Error(err);
        };

    }

    async lookupQH(userID){

        try{

            var qqData = await dbHelp.withTransaction(this.exDB, async () => {
                var SQL = "SELECT * FROM `Q_QUIZ_HISTORY` WHERE QQH_QU_ID=?";
                qqDebug.consoleLogger(SQL);
                qqDebug.consoleLogger(userID);
    
                return await this.exDB.runQuery(SQL, [userID]);
            });

            return qqData[0];

        } catch(err) {
            // API call failed...
            this.sysLogger.writeLogEntry(`quizHistoryDAO-lookupQuizHistory ${err.message}, ${err.stack}`);
            throw new Error(err);
        };
    }

    async lookupAll(){

        try{

            var qqData = await dbHelp.withTransaction(this.exDB, async () => {
                var SQL = "SELECT * FROM `Q_QUIZ_HISTORY` ORDER BY `QQH_QU_ID` ASC, `QQH_START_TS` ASC";
                qqDebug.consoleLogger(SQL);
                return await this.exDB.runQuery(SQL);
            });
            return qqData[0];
        } catch(err) {
            // API call failed...
            this.sysLogger.writeLogEntry(`quizHistoryDAO-lookupAll ${err.message}, ${err.stack}`);
            throw new Error(err);
        };
    }

    async deleteUser(userID){

        try{

            var qqData = await dbHelp.withTransaction(this.exDB, async () => {
                var SQL = "DELETE FROM `Q_USER` WHERE `QU_LOGIN`=?";
                return await this.exDB.runQuery(SQL, [userID]);
            });

            return qqData[0];

        } catch(err) {
            // API call failed...
            this.sysLogger.writeLogEntry(`userDAO-deleteUser ${err.message}, ${err.stack}`);
            throw new Error(err);
        };
    }


}

module.exports = quizHistoryDAO;