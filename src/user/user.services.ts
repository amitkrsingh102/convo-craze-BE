import { Prisma, User } from "@prisma/client";
import { db } from "../utils/db";

// returns a user from database with the given email
export function findUserWithEmail(email: string) {
	return db.user.findUnique({
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
// updates the username of the given email in the database
export function updateUserDetails(email: string, newUserName: string) {
	return db.user.update({
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
// creates a new message object
export function sentTextMessage(message: Prisma.MessageCreateManyInput) {
	return db.message.create({
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
// return a userObject with updated information from the database.
export function syncDb(email: string) {
	return db.user.findUnique({
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
// updates the avatarImage of the given email in the database
export function updateUserAvatar(email: string, imageNumber: number) {
	return db.user.update({
		where: { email },
		data: { avatarImage: imageNumber },
		select: { email: true, userName: true },
	});
}
