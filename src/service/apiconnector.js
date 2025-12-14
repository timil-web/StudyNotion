import axios from "axios";

export const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Remove quotes if token was stored with JSON.stringify
            const cleanToken = token.replace(/^"|"$/g, '');
            config.headers.Authorization = `Bearer ${cleanToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const apiconnector = (method,url,bodyData,headers,params) => {
	return axiosInstance({
		method : `${method}`,
		url : `${url}`,
		data : bodyData ? bodyData : null,
		headers : headers ? headers : null,	
		params : params ? params : null,
		withCredentials: true,
	})
}