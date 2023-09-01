import { db } from "../utils/db";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

export function registerUser(user: Prisma.UserCreateInput) {
	user.password = bcrypt.hashSync(user.password, 12);
	return db.user.create({
		data: user,
		select: {
			userName: true,
			email: true,
			createdAt: true,
		},
	});
}

export function findUserByEmail(email: string) {
	return db.user.findUnique({
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
export function findUserById(id: string) {
	return db.user.findUnique({
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
export function changeUserOnlineStatus(email: string, currentStatus: boolean) {
	return db.user.update({
		where: { email },
		data: { onlineStatus: currentStatus },
	});
}
