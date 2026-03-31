import mongoose, { Schema, model, Types } from "mongoose";
const messageSchema = new Schema({
    message: { type: String, required: true },
    senderId: { type: Types.ObjectId, ref: 'user', required: true },
    receiverId: { type: Types.ObjectId, ref: 'user', required: true },
}, { timestamps: true });

export const messageModel = mongoose.models.message || model("message", messageSchema);