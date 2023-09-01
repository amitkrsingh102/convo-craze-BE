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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = exports.Logout = exports.Login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const authServices = __importStar(require("./auth.services"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function Login(req, res, next) {
    try {
        const { email, password } = req.body;
        // checking for valid inputs
        if (!email || !password) {
            res.status(400);
            throw new Error("User data missing");
        }
        const user = await authServices.findUserByEmail(email);
        // checking for a valid user email (i.e registered email user)
        if (!user) {
            res.status(400);
            throw new Error(`no user with email '${email}' is registered`);
        }
        // authenticating the user with password comparison
        if (!bcrypt_1.default.compareSync(password, user.password)) {
            res.status(401);
            throw new Error("Invalid password");
        }
        // creation of auth tokens (JWT auth token)
        const authToken = jsonwebtoken_1.default.sign({ id: user.id, username: user.userName }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "7 days" });
        if (user.onlineStatus) {
            res.status(401);
            throw new Error("Session already active");
        }
        await authServices.changeUserOnlineStatus(user.email, true);
        res.status(200).json({
            message: `User ${user.userName} is logged in.`,
            user: await authServices.findUserById(user.id),
            authToken: authToken,
        });
    }
    catch (err) {
        next(err);
    }
}
exports.Login = Login;
async function Logout(req, res, next) {
    try {
        const { email, currentStatus } = req.body;
        if (!email) {
            res.status(400);
            throw new Error("Invalid request");
        }
        const user = await authServices.findUserByEmail(email);
        if (!user) {
            res.status(400);
            throw new Error(`no user with email '${email}' is registered`);
        }
        if (user.onlineStatus === false) {
            res.status(400);
            throw new Error("Invalid request");
        }
        await authServices.changeUserOnlineStatus(user.email, currentStatus);
        res.status(200).json({
            message: `User ${user.userName} is logged out.`,
        });
    }
    catch (err) {
        next(err);
    }
}
exports.Logout = Logout;
async function Register(req, res, next) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400);
            throw new Error("Invalid user input");
        }
        const user = await authServices.findUserByEmail(email);
        if (user) {
            res.status(400);
            throw new Error("Email already registered");
        }
        res.status(201).json(await authServices.registerUser({
            userName: username,
            email: email,
            password: password,
        }));
    }
    catch (err) {
        next(err);
    }
}
exports.Register = Register;
//# sourceMappingURL=auth.controllers.js.map