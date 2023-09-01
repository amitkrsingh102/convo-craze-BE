"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function auth(req, res, next) {
    try {
        const accessToken = req.header("Authorization")?.replace("Bearer ", "");
        if (!accessToken) {
            res.status(401);
            throw new Error("Token not found");
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
        req.token = decoded;
        next();
    }
    catch (err) {
        next(err);
    }
}
exports.auth = auth;
//# sourceMappingURL=auth.middleware.js.map