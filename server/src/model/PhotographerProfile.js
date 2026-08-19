const mongoose = require("mongoose");

const PhotographerProfileSchema = new mongoose.Schema({

    // Linked User Account
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bird user",
        required: true,
        unique: true
    },

    // Public Information
    displayName: {
        type: String,
        required: true,
        trim: true
    },

    // username: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true
    // },

    profileImage: {
        type: String,
        default: ""
    },

    coverImage: {
        type: String,
        default: ""
    },
    cameraImage: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        maxlength: 500,
        default: ""
    },

    // Location
    country: {
        type: String,
        default: ""
    },

    state: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    // Photography Experience
    experience: {
        type: String,
        enum: ["Beginner", "Intermediate", "Professional"],
        default: "Beginner"
    },

    // Camera Information
    cameraBrand: {
        type: String,
        default: ""
    },

    cameraModel: {
        type: String,
        default: ""
    },

    mainLens: {
        type: String,
        default: ""
    },

    zoomLens: {
        type: String,
        default: ""
    },

    // Social Links
    instagram: {
        type: String,
        default: ""
    },

    website: {
        type: String,
        default: ""
    },

    youtube: {
        type: String,
        default: ""
    },

    // Favorite Bird Categories
    specialization: [{
        type: String
    }],

    // Verification Status
    isVerified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

// PhotographerProfileSchema.index({
//     username: 1
// });

PhotographerProfileSchema.index({
    displayName: 1
});

PhotographerProfileSchema.index({
    specialization: 1
});

PhotographerProfileSchema.index({
    country: 1
});

module.exports = mongoose.model(
    "PhotographerProfile",
    PhotographerProfileSchema
);