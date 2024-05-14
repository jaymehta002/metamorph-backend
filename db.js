const mongoose = require('mongoose');
require('dotenv').config()


const connectToDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, {}).then(() => {
    console.log('Database connected');
}).catch((error) => {
    console.log('Error connecting to database', error);
});
}

module.exports = connectToDB;
