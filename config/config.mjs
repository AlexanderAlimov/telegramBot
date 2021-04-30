import dotenv from 'dotenv';

class Config {
    constructor(){
        dotenv.config();
    }

    getDbConnectionString(){
        return process.env.DB_CONNECT_STRING;
    }
}

export default Config;