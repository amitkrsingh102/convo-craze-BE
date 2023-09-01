import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
	token: string | JwtPayload;
}
export async function auth(req: Request, res: Response, next: NextFunction) {
	try {
		const accessToken = req.header("Authorization")?.replace("Bearer ", "");
		if (!accessToken) {
			res.status(401);
			throw new Error("Token not found");
		}
		const decoded = jwt.verify(
			accessToken,
			process.env.JWT_ACCESS_TOKEN as Secret
		);
		(req as CustomRequest).token = decoded;
		next();
	} catch (err) {
		next(err);
	}
}
