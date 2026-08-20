require("dotenv").config();
const validateEnvSchema=require("./config.schema")
const {
    port,
    database,
    jwt,
    email,
    cloudinaryCloudName,
    cloudinaryApiKey,
    cloudinaryApiSecret
} = validateEnvSchema(process.env);
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
    },
    cloudinary: {
        cloudName: cloudinaryCloudName,
        apiKey: cloudinaryApiKey,
        apiSecret: cloudinaryApiSecret
    }
}

module.exports=config;