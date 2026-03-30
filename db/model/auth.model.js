import mongoose, { Schema, model } from "mongoose";

const authSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
    status: {
      type: String,
      default: "Ofline",
      enum: ["Online", "Ofline"],
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    forgetcode: Number,
  },
  { timestamps: true }
);

export const authModel = mongoose.models.user || model("user", authSchema);
