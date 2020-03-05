const mysql = require( 'mysql2/promise' );

const dbconfig = {
    connectionLimit: 50,
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
};

var dbpool;

const mySQLPool = async () => {
    try{
        if (!dbpool) {
            
            return dbpool = await mysql.createPool( dbconfig );
        } else{
            return dbpool;
        }
    } catch(err) {
        // API call failed...
        console.error(`Database-dbconnpool ${err.message}, ${err.stack}`);
        return err.message
    } 
    
};


module.exports = {
    getPool: mySQLPool
};