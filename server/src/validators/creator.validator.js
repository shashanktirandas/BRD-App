const { z } = require("zod");

const displayNameSchema=z.string()
                          .trim()
                          .min(3,"Display Name must be at least 3 characters")
                          .max(50,"Display Name can not exceed 50 characters")

// const profileImageSchema=z.string()
//                          .url()
// const coverImageSchema=z.string()
//                          .url()
const bioSchema=z.string()
                         .trim()
                         .max(500,"Bio can not exceed 500 characters.")
const countrySchema=z.string()
                         .trim()
                         .min(1, "Country is required")
const stateSchema=z.string()
                         .trim()
                         .min(1, "State is required")
const citySchema=z.string()
                         .trim()
                         .min(1, "City is required")
const experienceSchema=z.string()
                         .default("Beginner")
const cameraBrandSchema=z.string()
                         .trim()
                         .min(1, "Camera Brand is required")
const cameraModelSchema=z.string()
                         .trim()
                         .min(1, "Camera Model is required")
const mainLensSchema=z.string()
                         .trim()
const instagramSchema = z.string().url().or(z.literal(""));
const websiteSchema = z.string().url().or(z.literal(""));
const youtubeSchema = z.string().url().or(z.literal(""));
const specializationItemSchema = z.string()
                                  .trim()
                                  .min(3,"specialization Item must be at least 3 characters")
                                  .max(30,"specialization Item can not exceed 30 characters")               
const specializationSchema=z.array(specializationItemSchema)
                            .min(1,"Atleast one Specialization required")
                            .max(5,"Specialization can not exceed more than five")


const registerCreatorSchema = z.object({

    displayName: displayNameSchema,

    bio: bioSchema.optional(),

    country: countrySchema,

    state: stateSchema,

    city: citySchema,

    experience: experienceSchema.optional(),

    cameraBrand: cameraBrandSchema,

    cameraModel: cameraModelSchema,

    mainLens: mainLensSchema.optional(),

    instagram: instagramSchema.optional(),

    website: websiteSchema.optional(),

    youtube: youtubeSchema.optional(),

    specialization: specializationSchema

});

module.exports={
    registerCreatorSchema
}