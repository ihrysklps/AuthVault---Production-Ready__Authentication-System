import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
const authRouter = Router();
/** Registering a user 
 * POST /api/auth/register */
authRouter.post("/register",authController.register) 
/** POST /api/auth/login */
authRouter.post("/login",authController.login)

/**GET /api/auth/get-me */
authRouter.get("/get-me", authController.getMe)
/**GET /api/auth/refresh-token
 * Endpoint for refresh token */
authRouter.get("/refresh-token", authController.refreshToken)
/** LOGOUT */
authRouter.get("/logout", authController.logout)
/** Simultaneusly Logout from all devices */
authRouter.get("/logout-all", authController.logoutAll)
/** GET /api/auth/email-verify */
authRouter.get("/email-verify",authController.verifyEmail)
export default authRouter;
