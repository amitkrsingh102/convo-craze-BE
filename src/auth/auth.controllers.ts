import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import * as authServices from "./auth.services";
import jwt, { Secret } from "jsonwebtoken";

export async function Login(req: Request, res: Response, next: NextFunction) {
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
		if (!bcrypt.compareSync(password, user.password)) {
			res.status(401);
			throw new Error("Invalid password");
		}

		// creation of auth tokens (JWT auth token)
		const authToken = jwt.sign(
			{ id: user.id, username: user.userName },
			process.env.JWT_ACCESS_TOKEN as Secret,
			{ expiresIn: "7 days" }
		);

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
	} catch (err) {
		next(err);
	}
}

export async function Logout(req: Request, res: Response, next: NextFunction) {
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
	} catch (err) {
		next(err);
	}
}

export async function Register(
	req: Request,
	res: Response,
	next: NextFunction
) {
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
		res.status(201).json(
			await authServices.registerUser({
				userName: username,
				email: email,
				password: password,
			})
		);
	} catch (err) {
		next(err);
	}
}
