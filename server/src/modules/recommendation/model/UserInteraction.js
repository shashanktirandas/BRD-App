const mongoose = require("mongoose");
const InteractionTypes = require("../constants/interaction.types");

const UserInteractionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BirdPost",
            default: null,
            index: true
        },

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PhotographerProfile",
            default: null,
            index: true
        },

        interactionType: {
            type: String,
            enum: Object.values(InteractionTypes),
            required: true,
            index: true
        },

        searchQuery: {
            type: String,
            trim: true,
            default: null
        },

        duration: {
            type: Number,
            default: 0
        },

        metadata: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

UserInteractionSchema.index({
    user: 1,
    interactionType: 1,
    createdAt: -1
});

UserInteractionSchema.index({
    user: 1,
    post: 1
});

module.exports = mongoose.model(
    "UserInteraction",
    UserInteractionSchema
);