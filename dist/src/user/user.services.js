"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserAvatar = exports.syncDb = exports.sentTextMessage = exports.updateUserDetails = exports.findUserWithEmail = void 0;
const db_1 = require("../utils/db");
// returns a user from database with the given email
function findUserWithEmail(email) {
    return db_1.db.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            userName: true,
            avatarImage: true,
            onlineStatus: true,
        },
    });
}
exports.findUserWithEmail = findUserWithEmail;
// updates the username of the given email in the database
function updateUserDetails(email, newUserName) {
    return db_1.db.user.update({
        where: { email },
        data: {
            userName: newUserName,
        },
        select: {
            email: true,
            userName: true,
        },
    });
}
exports.updateUserDetails = updateUserDetails;
// creates a new message object
function sentTextMessage(message) {
    return db_1.db.message.create({
        data: message,
        select: {
            text: true,
            sendAt: true,
            sender: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    avatarImage: true,
                },
            },
            receiver: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                    avatarImage: true,
                },
            },
        },
    });
}
exports.sentTextMessage = sentTextMessage;
// return a userObject with updated information from the database.
function syncDb(email) {
    return db_1.db.user.findUnique({
        where: { email },
        select: {
            userName: true,
            email: true,
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
                            onlineStatus: true,
                            avatarImage: true,
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
                            onlineStatus: true,
                            avatarImage: true,
                        },
                    },
                },
            },
        },
    });
}
exports.syncDb = syncDb;
// updates the avatarImage of the given email in the database
function updateUserAvatar(email, imageNumber) {
    return db_1.db.user.update({
        where: { email },
        data: { avatarImage: imageNumber },
        select: { email: true, userName: true },
    });
}
exports.updateUserAvatar = updateUserAvatar;
//# sourceMappingURL=user.services.js.map