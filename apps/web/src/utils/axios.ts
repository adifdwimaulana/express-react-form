import axios from "axios";

const apiClient = axios.create({
	baseURL: "http://localhost:8000/api",
	timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
	config.url = `${config.baseURL}${config.url}`;

	return config;
});

export default apiClient;
