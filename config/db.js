const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log(`MongoDB connected: ${conn.connection.host}`) ;      
    } catch (err) {
        console.log(`Could not connect to database: ${process.env.MONGO_URI}`);
        console.log(`Error message: ${err.message}`);
        process.exit(1);       
    };
};

module.exports = connectDB;