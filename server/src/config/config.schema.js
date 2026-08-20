const z = require("zod");
const { ValidationError } = require("../errors/AppError");

const portSchema = z.number()
    .positive();

const jwtSchema = z.string()
    .min(1, "JWT SECRET KEY Required");

const databaseSchema = z.string()
    .min(1, "Database URI is required");

const emailSchema = z.string()
    .min(1, "Email API is required");

const cloudinaryCloudNameSchema = z.string()
    .min(1, "Cloudinary cloud name is required");

const cloudinaryApiKeySchema = z.string()
    .min(1, "Cloudinary API key is required");

const cloudinaryApiSecretSchema = z.string()
    .min(1, "Cloudinary API secret is required");

const envSchema = z.object({
    port: portSchema,
    jwt: jwtSchema,
    database: databaseSchema,
    email: emailSchema,

    cloudinaryCloudName: cloudinaryCloudNameSchema,
    cloudinaryApiKey: cloudinaryApiKeySchema,
    cloudinaryApiSecret: cloudinaryApiSecretSchema
});

const validateEnvSchema = (processEnv) => {
    try {
        return envSchema.parse({
            port: Number(processEnv.PORT),
            jwt: processEnv.JWT_SECRET,
            database: processEnv.MONGODB_URI,
            email: processEnv.BREVO_API_KEY,

            cloudinaryCloudName: processEnv.CLOUDINARY_CLOUD_NAME,
            cloudinaryApiKey: processEnv.CLOUDINARY_API_KEY,
            cloudinaryApiSecret: processEnv.CLOUDINARY_API_SECRET
        });
    } catch (err) {
        throw new ValidationError(err);
    }
};

module.exports = validateEnvSchema;