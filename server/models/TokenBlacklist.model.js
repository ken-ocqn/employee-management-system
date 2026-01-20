import mongoose from "mongoose";

const TokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: '0s' } // TTL index to automatically remove expired tokens
    }
}, { timestamps: true });

export const TokenBlacklist = mongoose.model("TokenBlacklist", TokenBlacklistSchema);
