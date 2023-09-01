import { Router } from "express";
import * as authController from "./auth.controllers";
import { CustomRequest, auth } from "./auth.middleware";

const router = Router();

router.post("/login", authController.Login);
router.put("/logout", authController.Logout);
router.post("/register", authController.Register);

router.get("/", (req, res) => {
	res.json({
		message: "auth Live...",
	});
});

export default router;
