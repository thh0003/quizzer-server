const request = require("request");
const rp = require("request-promise");
const DB = require('./database');
const dbHelp = require('./dbHelper');
const systemLog = require("./sysLog");

class userDAO {
    constructor() {
        this.exDB = new DB();
        this.sysLogger = new systemLog("userDAO");
    }

    async addUser(exValues){
        try{
            var qqData = await dbHelp.withTransaction(this.exDB, async () => {
                var addSQL = "INSERT INTO `Q_USER` (`QU_LOGIN`, `QU_ROLE` ) VALUES (?,?)";
                this.sysLogger.writeLogEntry("Adding User: "+addSQL);
    
                return await this.exDB.runQuery(addSQL, exValues);
            });
            return qqData[0];
        } catch(err) {
            // API call failed...
            this.sysLogger.writeLogEntry(`userDAO-addUser ${err.message}, ${err.stack}`);
            throw new Error(err);
        };

    }

    async updateUser(exValues){
        try{
            var qqData = await dbHelp.withTransaction(this.exDB, async () => {
                var addSQL = "UPDATE `Q_USER` SET `QU_ROLE`=? WHERE `QU_LOGIN`=?";
                this.sysLogger.writeLogEntry("Updating User: "+addSQL);
    
                return await this.exDB.runQuery(addSQL, exValues);
            });
            return qqData;

        } catch(err) {
            // API call failed...
            this.sysLogger.writeLogEntry(`userDAO-updateUser ${err.message}, ${err.stack}`);
            throw new Error(err);
        };

    }

    async lookupUser(userID){

        try{
            var qqData = await dbHelp.withTransaction(this.exDB, async () => {
                var SQL = "SELECT * FROM `Q_USER` WHERE QU_LOGIN=?";
                return await this.exDB.runQuery(SQL, [userID]);
            });

            return qqData[0];

        } catch(err) {
            // API call failed...
            this.sysLogger.writeLogEntry(`userDAO-lookupUser ${err.message}, ${err.stack}`);
            throw new Error(err);
        };
    }

    async usersLookupAll(userID){

        try{
            var qqData = await dbHelp.withTransaction(this.exDB, async () => {
                var SQL = "SELECT * FROM `Q_USER` ORDER BY `QU_LOGIN`";
                return await this.exDB.runQuery(SQL, [userID]);
            });

            return qqData[0];

        } catch(err) {
            // API call failed...
            this.sysLogger.writeLogEntry(`userDAO-usersLookupAll ${err.message}, ${err.stack}`);
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

module.exports = userDAO;