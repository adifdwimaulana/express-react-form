import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { seedingFormConfig, seedingValidator } from "./schema";
import { router } from "./route";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/v1", router);

const PORT = process.env.PORT || 8000;
const MONGO_URI =
	process.env.MONGO_URI ||
	"mongodb://application:application@localhost:27018/frankie-db?authSource=frankie-db";

initDBConnection();

app.get("/health", (_req: Request, res: Response) => {
	res.json({ status: "OK" });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

async function initDBConnection() {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Connected to MongoDB");

		await seedingFormConfig();
		await seedingValidator();
		console.log("Seeding config completed");
	} catch (err) {
		console.error("MongoDB connection error:", err);
	}
}
