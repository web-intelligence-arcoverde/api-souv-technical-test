import { randomBytes } from "node:crypto";
import axios from "axios";

const TARGET_URL = "http://localhost:3001";

const debug = async () => {
	const randomSuffix = randomBytes(4).toString("hex");
	const email = `debug_${randomSuffix}@example.com`;
	const password = "password123";

	try {
		console.log(`📝 Registering user: ${email}`);
		await axios.post(`${TARGET_URL}/auth/register`, {
			name: "Debug User",
			email,
			password,
		});

		console.log("🔑 Logging in...");
		const loginRes = await axios.post(`${TARGET_URL}/auth/login`, {
			email,
			password,
		});

		const token = loginRes.data.token;
		console.log("✅ Token obtained:", token.substring(0, 20) + "...");

		console.log("📡 Making GET /shopping-list request...");
		try {
			const res = await axios.get(`${TARGET_URL}/shopping-list`, {
				headers: {
					authorization: `Bearer ${token}`,
					"x-load-test-bypass": "true",
				},
			});
			console.log("🎉 SUCCESS!", res.status, res.data);
		} catch (error: any) {
			console.error("❌ REQUEST FAILED");
			if (error.response) {
				console.error("Status:", error.response.status);
				console.error("Data:", JSON.stringify(error.response.data));
				console.error("Headers:", JSON.stringify(error.response.headers));
			} else {
				console.error("Error Message:", error.message);
			}
		}
	} catch (error: any) {
		console.error("❌ SETUP FAILED");
		if (error.response) {
			console.error("Status:", error.response.status);
			console.error("Data:", JSON.stringify(error.response.data));
		} else {
			console.error(error.message);
		}
	}
};

debug();
