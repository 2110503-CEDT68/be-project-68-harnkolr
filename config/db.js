const mongoose = require('mongoose');

const connetDB = async () =>{
    mongoose.set('strictQuery' , true);
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = connetDB;