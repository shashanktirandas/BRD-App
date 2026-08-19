
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        required: true
    },

    purpose: {
        type: String,
        enum: [
            "signup",
            "profile-update",
            "profile-transform",
            "forgot-password",
            "delete-account",
            "creator-update"
        ],
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Otp", otpSchema);