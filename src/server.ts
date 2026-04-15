import dotenv from "dotenv";
import { cpuProfiling } from "./config/cpu-profiling";

const { start, stop } = cpuProfiling();

dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
start();

const exitSignals = ["SIGINT", "SIGTERM", "SIGQUIT"];

exitSignals.forEach((signal) => {
	process.once(signal, async () => {
		await stop();
		process.exit(0);
	});
});
