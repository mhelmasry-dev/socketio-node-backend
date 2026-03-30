import { authModel } from "../../../../db/model/auth.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorhandling.js";
export const getuser = asyncHandler(async (req, res, next) => {
  const user = await req.user;
  return res.status(200).json({ message: "done", user });
});

export const profileImage = asyncHandler(async (req, res, next) => {
  const user = await authModel.findById(req.user._id);
  if (user.image && user.image.public_id) {
    await cloudinary.uploader.destroy(user.image.public_id);
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `userApp/profile_pictures`,
    }
  );
  const newuser = await authModel.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { image: { secure_url, public_id } } },
    { new: true }
  );
  res.json({
    message: "Profile picture uploaded and updated successfully",
    newuser,
  });
});
