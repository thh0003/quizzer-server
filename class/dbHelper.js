exports.withTransaction = async (db, callback) => {
    try{
        await db.getPool();
        await db.getConn();
        await db.startTrans();
        let retVal = await callback();
        await db.commit();
        return retVal;
    } catch (err){
        await db.rollback();
        throw err;
    } finally{
        await db.close();
    }

};
