import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./middlewares";
import api from "./api";
import auth from "./auth/auth.routes";
import user from "./user/user.routes";
import MessageResponse from "./interfaces/MessageResponse";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>("/", (req, res) => {
	res.json({
		message: "Live...",
	});
});

app.use("/api", api);
app.use("/auth", auth);
app.use("/user", user);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
