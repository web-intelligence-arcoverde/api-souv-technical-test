import { randomBytes } from "node:crypto";
import autocannon from "autocannon";

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3001";

const runTest = async (name: string, options: any) => {
	console.log(`\n🚀 Starting Load Test: ${name}`);
	console.log(`📍 URL: ${options.url}`);

	return new Promise((resolve, reject) => {
		const instance = autocannon(options, (err: any, result: any) => {
			if (err) {
				console.error(`❌ Error in ${name}:`, err);
				reject(err);
				return;
			}
			console.log(`\n✅ Finished Load Test: ${name}`);
			console.log(autocannon.printResult(result));
			resolve(result);
		});

		autocannon.track(instance, { renderProgressBar: true });
	});
};

const startLoadTests = async () => {
	try {
		// 1. Login Load Test
		await runTest("Auth - Login", {
			url: `${TARGET_URL}/auth/login`,
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				email: "test@example.com",
				password: "password123",
			}),
			connections: 10,
			duration: 20,
			pipelining: 1,
		});

		// 2. Register Load Test
		// Note: Using setup function to generate unique emails
		await runTest("Auth - Register", {
			url: `${TARGET_URL}/auth/register`,
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			setupClient: (client: any) => {
				client.on("response", (status: number, body: string) => {
					// We can track responses here if needed
				});
			},
			requests: [
				{
					method: "POST",
					path: "/auth/register",
					setupRequest: (request: any) => {
						const randomSuffix = randomBytes(4).toString("hex");
						request.body = JSON.stringify({
							name: "Load Test User",
							email: `user_${randomSuffix}@example.com`,
							password: "password123",
						});
						return request;
					},
				},
			],
			connections: 5, // Lower connections for register as it's more heavy
			duration: 20,
		});
	} catch (error) {
		console.error("Critical error running load tests:", error);
		process.exit(1);
	}
};

startLoadTests();
