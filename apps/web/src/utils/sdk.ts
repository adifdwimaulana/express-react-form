import axios from "axios";

const sdkClient = axios.create({
	baseURL: "https://places.googleapis.com/v1",
	timeout: 5000,
	headers: {
		"X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_API_KEY,
		"Content-Type": "application/json",
		"X-Goog-FieldMask": [
			"places.displayName",
			"places.formattedAddress",
			"places.id",
		],
	},
});

sdkClient.interceptors.request.use((config) => {
	config.url = `${config.baseURL}${config.url}`;

	return config;
});

export default sdkClient;
