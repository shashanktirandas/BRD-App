const mongoose = require("mongoose");

const RecommendationProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },

        birds: {
            type: Map,
            of: Number,
            default: {}
        },

        creators: {
            type: Map,
            of: Number,
            default: {}
        },

        tags: {
            type: Map,
            of: Number,
            default: {}
        },

        locations: {
            type: Map,
            of: Number,
            default: {}
        },

        cameras: {
            type: Map,
            of: Number,
            default: {}
        },
        engagementScore: {
            type: Number,
            default: 0
        },

        explorationScore: {
            type: Number,
            default: 0
        },

        lastInteractionAt: {
            type: Date,
            default: null
        },

        lastCalculatedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model(
    "RecommendationProfile",
    RecommendationProfileSchema
);