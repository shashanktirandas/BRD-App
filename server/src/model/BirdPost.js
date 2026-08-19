const mongoose = require("mongoose");

const BirdPostSchema = new mongoose.Schema({

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PhotographerProfile",
        required: true
    },

    birdName: {
        type: String,
        required: true,
        trim: true
    },

    scientificName: {
        type: String,
        default: ""
    },

    images: [{
        type: String
    }],

    description: {
        type: String,
        required: true
    },

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

    capturedAt: {
        type: Date
    },

    cameraBrand: {
        type: String,
        default: ""
    },

    cameraModel: {
        type: String,
        default: ""
    },

    lens: {
        type: String,
        default: ""
    },

    tags: [{
        type: String
    }]

}, {
    timestamps: true
});

BirdPostSchema.index({
    creator: 1
});

BirdPostSchema.index({
    birdName: 1
});

BirdPostSchema.index({
    scientificName: 1
});

BirdPostSchema.index({
    tags: 1
});

BirdPostSchema.index({
    createdAt: -1
});

BirdPostSchema.index({
    country: 1,
    birdName: 1
});

module.exports = mongoose.model(
    "BirdPost",
    BirdPostSchema
);