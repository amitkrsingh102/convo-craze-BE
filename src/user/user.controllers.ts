import { Request, Response, NextFunction } from "express";
import * as userServices from "./user.services";

export async function changeUserName(
	req: Request,
	res: Response,
	next: NextFunction
) {
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
		res.status(200).json(
			await userServices.updateUserDetails(user.email, newUsername)
		);
	} catch (err) {
		next(err);
	}
}

export async function sendMessage(
	req: Request,
	res: Response,
	next: NextFunction
) {
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
		res.status(200).json(
			await userServices.sentTextMessage({
				text: text,
				senderId: fromUser.id,
				receiverId: toUser.id,
			})
		);
	} catch (err) {
		next(err);
	}
}
export async function findUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
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
	} catch (err) {
		next(err);
	}
}

export async function changeUserAvatar(
	req: Request,
	res: Response,
	next: NextFunction
) {
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
		res.status(200).json(
			await userServices.updateUserAvatar(email, imageNumber)
		);
	} catch (err) {
		next(err);
	}
}
