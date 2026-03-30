import { auth, roles } from "../../middleware/auth.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as userController from "./controller/user.js";
import { Router } from "express";
const router = Router();

router.get("/", auth(Object.values(roles)), userController.getuser);
router.patch(
  "/",
  auth(Object.values(roles)),
  fileUpload(fileValidation.image).single("image"),
  userController.profileImage
);
export default router;
