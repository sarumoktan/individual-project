const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(///PostgreSQL ma chahine set up  garxa real connection yaha hudaina port process.env line samma ko code yi line every project ma compulsory lekhnai parxa
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
        port: process.env.DB_PORT||5432,
    }
);

//Yo function call garyo bhane Database connect hunxa or  real connection check  garxa like username ,password,Host,database name sab thik xa ki xaina bhanera verify garxa Error aayo bhane console ma dekhaunxa
const connectDB = async () => {
    try {
        await sequelize.authenticate();//Actual database connect huney line
        console.log("postgreSQL connect successfully.");
            
    } catch (error) {
        console.error('Unable to connect to the database:', error);

    }
};

module.exports = { sequelize, connectDB };

