require("dotenv").config();
const validateEnvSchema=require("./config.schema")
const {port,database,jwt,email}=validateEnvSchema(process.env);
const config={
    server:{
        port
    },
    database:{
        uri:database
    },
    jwt:{
        secret:jwt
    },
    email:{
        api:email
    }
}

module.exports=config;