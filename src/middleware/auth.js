import jwt from "jsonwebtoken";
import { authModel } from "../../db/model/auth.model.js";
export const roles = {
  Admin: "Admin",
  User: "User",
};
export const auth = (accessRoles = []) => {
  return async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;

      if (!token) {
        return next(new Error("In-valid Token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded?.id) {
        return next(new Error("Invalid token payload"));
      }

      const user = await authModel.findById(decoded.id);
      if (!user) {
        return next(new Error("Account not registered"));
      }

      if (!accessRoles.includes(user.role)) {
        return next(new Error("User not authorized"));
      }
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication Error"));
    }
  };
};
