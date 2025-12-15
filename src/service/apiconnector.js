import axios from "axios";

export const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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
// export const apiconnector = (method, url, bodyData, headers, params) => {
//   return axiosInstance({
//     method,
//     url,
//     data: bodyData || null,
//     headers: headers || null,
//     params: params || null,
//   });
// };