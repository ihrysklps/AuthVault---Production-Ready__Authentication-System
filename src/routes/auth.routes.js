import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter.post("/register",authController.register) // POST --- /api/auth/register



/**GET /api/auth/get-me */
authRouter.get("/get-me", authController.getMe)
/**Get /api/auth/refresh-token
 * Endpoint for refresh token */
authRouter.get("/refresh-token", authController.refreshToken)
/** LOGOUT */
authRouter.get("/logout", authController.logout)
export default authRouter;
