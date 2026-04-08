import * as admin from "firebase-admin";

const serviceAccount = require("../../shopping-list-5758e-firebase-adminsdk-fbsvc-334e1a2a4a.json");

// apiKey is needed for the Auth REST API (login)
export const firebaseConfig = {
	apiKey: "AIzaSyDOlt6FIvBkbxSu5s9199fIiiIgUlq6ObQ",
};

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

export const auth = admin.auth();
export const db = admin.firestore();
