import { connect } from "../db/connection.js";
import cors from "cors";
import authRouter from "../src/modules/auth/auth.router.js";
import userRouter from "../src/modules/user/user.router.js";
import { asyncHandler, handelerror } from "../src/utils/errorhandling.js";
export const bootstarp = (app, express) => {
  app.use(cors());
  app.use(express.json());
  connect();
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use(asyncHandler);
  app.use(handelerror);

};
