const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB,{ useNewUrlParser: true, useUnifiedTopology: true,})   
        console.log(`MongoDB connected To ${conn.connection.host}`)
    } catch (error) {
        console.log(`error:${error}`)
        process.exit();
    }
    

}

module.exports = dbConnection;