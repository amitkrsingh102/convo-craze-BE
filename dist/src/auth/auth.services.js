"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserOnlineStatus = exports.findUserById = exports.findUserByEmail = exports.registerUser = void 0;
const db_1 = require("../utils/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
function registerUser(user) {
    user.password = bcrypt_1.default.hashSync(user.password, 12);
    return db_1.db.user.create({
        data: user,
        select: {
            userName: true,
            email: true,
            createdAt: true,
        },
    });
}
exports.registerUser = registerUser;
function findUserByEmail(email) {
    return db_1.db.user.findUnique({
        where: { email },
        select: {
            id: true,
            userName: true,
            email: true,
            password: true,
            avatarImage: true,
            onlineStatus: true,
        },
    });
}
exports.findUserByEmail = findUserByEmail;
function findUserById(id) {
    return db_1.db.user.findUnique({
        where: { id },
        select: {
            email: true,
            userName: true,
            createdAt: true,
            avatarImage: true,
            onlineStatus: true,
            sentMessages: {
                select: {
                    sendAt: true,
                    text: true,
                    receiver: {
                        select: {
                            userName: true,
                            email: true,
                            avatarImage: true,
                            onlineStatus: true,
                        },
                    },
                },
            },
            receivedMessages: {
                select: {
                    sendAt: true,
                    text: true,
                    sender: {
                        select: {
                            userName: true,
                            email: true,
                            avatarImage: true,
                            onlineStatus: true,
                        },
                    },
                },
            },
        },
    });
}
exports.findUserById = findUserById;
function changeUserOnlineStatus(email, currentStatus) {
    return db_1.db.user.update({
        where: { email },
        data: { onlineStatus: currentStatus },
    });
}
exports.changeUserOnlineStatus = changeUserOnlineStatus;
//# sourceMappingURL=auth.services.js.map