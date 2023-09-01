import app from "./app";
import socketIo from "socket.io";
import * as userServices from "./user/user.services";
import { db } from "./utils/db";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
const io = new socketIo.Server(server, {
	pingInterval: 60000,
	cors: {
		origin: process.env.FRONT_END_URL || "http://127.0.0.1:5173",
	},
});

io.on("connection", (socket) => {
	console.log("client connected: ", socket.id);
	socket.on("setup", async (userData) => {
		userData && socket.join(userData.id);
		userData && socket.emit("userData", await sendUserData(userData.email));
	});

	socket.on("disconnect", (reason) => {
		console.log(reason);
	});
});

const sendUserData = async (email: string) => {
	const data = userServices.syncDb(email);
	return data;
};
