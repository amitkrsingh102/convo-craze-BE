"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserAvatar = exports.findUser = exports.sendMessage = exports.changeUserName = void 0;
const userServices = __importStar(require("./user.services"));
async function changeUserName(req, res, next) {
    try {
        const { email, newUsername } = req.body;
        if (!email || !newUsername) {
            res.status(400);
            throw new Error("Invalid input");
        }
        const user = await userServices.findUserWithEmail(email);
        if (!user) {
            res.status(400);
            throw new Error(`User with '${email}' not found`);
        }
        if (user.userName === newUsername) {
            res.status(400);
            throw new Error("New username cannot be same as old username");
        }
        res.status(200).json(await userServices.updateUserDetails(user.email, newUsername));
    }
    catch (err) {
        next(err);
    }
}
exports.changeUserName = changeUserName;
async function sendMessage(req, res, next) {
    try {
        const { fromEmail, toEmail, text } = req.body;
        if (!fromEmail || !toEmail || !text) {
            res.status(400);
            throw new Error("Invalid request, message cannot be sent");
        }
        if (fromEmail === toEmail) {
            res.status(400);
            throw new Error("Cannot send message to yourself");
        }
        const fromUser = await userServices.findUserWithEmail(fromEmail);
        const toUser = await userServices.findUserWithEmail(toEmail);
        if (!fromUser || !toUser) {
            res.status(400);
            throw new Error("User not found");
        }
        res.status(200).json(await userServices.sentTextMessage({
            text: text,
            senderId: fromUser.id,
            receiverId: toUser.id,
        }));
    }
    catch (err) {
        next(err);
    }
}
exports.sendMessage = sendMessage;
async function findUser(req, res, next) {
    try {
        const userEmail = req.params.userEmail;
        if (!userEmail) {
            res.status(400);
            throw new Error("Invalid input");
        }
        if (!(await userServices.findUserWithEmail(userEmail))) {
            res.status(400);
            throw new Error("User not found");
        }
        res.status(200).json(await userServices.findUserWithEmail(userEmail));
    }
    catch (err) {
        next(err);
    }
}
exports.findUser = findUser;
async function changeUserAvatar(req, res, next) {
    const { email, imageNumber } = req.body;
    try {
        if (!email || !imageNumber) {
            res.status(400);
            throw new Error("Invalid Input");
        }
        const user = await userServices.findUserWithEmail(email);
        if (!user) {
            res.status(400);
            throw new Error(`User with email ${email} is not found`);
        }
        if (user.avatarImage === imageNumber) {
            res.status(400);
            throw new Error("New image should not be same as old image");
        }
        res.status(200).json(await userServices.updateUserAvatar(email, imageNumber));
    }
    catch (err) {
        next(err);
    }
}
exports.changeUserAvatar = changeUserAvatar;
//# sourceMappingURL=user.controllers.js.map