import { randomBytes } from "node:crypto";
import autocannon from "autocannon";
import axios from "axios";

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

const setupTestUser = async () => {
	const randomSuffix = randomBytes(4).toString("hex");
	const email = `loadtest_${randomSuffix}@example.com`;
	const password = "password123";

	try {
		console.log(`📝 Registering user: ${email}`);
		await axios.post(`${TARGET_URL}/auth/register`, {
			name: "Load Test User",
			email,
			password,
		});

		console.log("🔑 Logging in...");
		const response = await axios.post(`${TARGET_URL}/auth/login`, {
			email,
			password,
		});

		return response.data.token;
	} catch (error) {
		console.error(
			"❌ Failed to setup test user. Make sure the server is running.",
		);
		throw error;
	}
};

const startLoadTests = async () => {
	try {
		const token = await setupTestUser();
		console.log("✅ Authenticated successfully.");

		// 1. List Shopping Lists Load Test (GET)
		await runTest("Shopping List - Listing", {
			url: `${TARGET_URL}/shopping-list`,
			method: "GET",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${token}`,
				"x-load-test-bypass": "true",
			},
			connections: 10,
			duration: 15,
		});

		// 2. Create Shopping List Load Test (POST)
		await runTest("Shopping List - Creation", {
			url: `${TARGET_URL}/shopping-list`,
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${token}`,
				"x-load-test-bypass": "true",
			},
			body: JSON.stringify({
				title: "Load Test List",
				category: "StressTest",
				variant: "secondary",
				items: [
					{
						name: "Bread",
						price: 2,
						quantity: 1,
						category: "Bakery",
						unit: "un",
						marketName: "Market A",
						checked: false,
					},
					{
						name: "Milk",
						price: 5,
						quantity: 2,
						category: "Dairy",
						unit: "L",
						marketName: "Market B",
						checked: false,
					},
				],
			}),
			connections: 5,
			duration: 5,
		});
	} catch (error) {
		console.error("Critical error running load tests:", error);
		process.exit(1);
	}
};

startLoadTests();
