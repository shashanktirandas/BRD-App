
const z=require("zod");
const {ValidationError}=require("../errors/AppError")
const portSchema=z.number()
                  .positive()
const jwtSchema=z.string()
                  .min(1,"JWT SECRET KEY Required")
const databaseSchema=z.string()
                      .min(1, "Database URI is required")

const emailSchema=z.string()
                    .min(1, "Email API is required")

const envSchema=z.object({
    port:portSchema,
    jwt:jwtSchema,
    database:databaseSchema,
    email:emailSchema
})
const validateEnvSchema=(processEnv)=>{
    try{
        return envSchema.parse({
        port:Number(processEnv.PORT),
        jwt:processEnv.JWT_SECRET,
        database:processEnv.MONGODB_URI,
        email:processEnv.BREVO_API_KEY
    })
    }catch(err){
        throw new ValidationError(err);
    }
}
module.exports=validateEnvSchema;