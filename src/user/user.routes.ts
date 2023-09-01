import * as userController from "./user.controllers";
import Router from "express";
import { auth } from "../auth/auth.middleware";

const router = Router();

router.get("/find/:userEmail", auth, userController.findUser);
router.post("/send", auth, userController.sendMessage);
router.put("/update/avatar", auth, userController.changeUserAvatar);
router.put("/update/username", auth, userController.changeUserName);

export default router;
