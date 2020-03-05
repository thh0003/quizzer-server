const util = require( 'util' );
const systemLog = require("./sysLog");
const mysql = require( 'mysql2/promise' );
mySQLPool = require("./dbconnpool");


const dbconfig = {
    connectionLimit: 50,
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
};

class Database {
    
    constructor() {
        this.sysLogger = new systemLog("Database");
//        this.pool = dbpool.getPool();
        this.pool;
        this.conn;
    }

    async getPool() {
        try{
            this.pool = await mySQLPool.getPool();
        } catch(err) {
            // API call failed...
            this.sysLogger.writeErrorEntry(`Database-getPool ${err.message}, ${err.stack}`);
            throw err
        };
     }

     async closePool() {
        try{
            return await this.pool.end();
        } catch(err) {
            // API call failed...
            this.sysLogger.writeErrorEntry(`Database-getPool ${err.message}, ${err.stack}`);
            throw err
        };
     }

     async getConn() {
        try{
            this.conn = await this.pool.getConnection();
        } catch(err) {
            // API call failed...
            this.sysLogger.writeErrorEntry(`Database-getConn ${err.message}, ${err.stack}`);
            throw err
        };
     }
    
    async runQuery( sql, args ) {
        try{
            let result = await this.conn.query(sql, args);
//            console.log(result);
            return result;
        } catch(err) {
            // API call failed...
            this.sysLogger.writeErrorEntry(`Database-runQuery ${err.message}, ${err.stack}`);
            throw err
        };
     }

     async startTrans(){
         try {
             return await this.conn.beginTransaction();
         } catch(err) {
            // API call failed...
            this.sysLogger.writeErrorEntry(`Database-startTrans ${err.message}, ${err.stack}`);
            throw err
        };
     }

     async commit(){
        try{
            return await this.conn.commit();
        } catch(err) {
            // API call failed...
            this.sysLogger.writeErrorEntry(`Database-commit ${err.message}, ${err.stack}`);
            throw err
        };
    }

    async rollback(){
        try{
            return await this.conn.rollback();
        } catch(err) {
            // API call failed...
            this.sysLogger.writeErrorEntry(`Database-rollback ${err.message}, ${err.stack}`);
            throw err
        };    
    }

    async close() {
        try{
            return await this.conn.release();
        } catch(err) {
            // API call failed...
            this.sysLogger.writeErrorEntry(`Database-close ${err.message}, ${err.stack}`);
            console.error(`Database-close ${err.message}, ${err.stack}`);
            throw err
        };    
    }


}

module.exports = Database;