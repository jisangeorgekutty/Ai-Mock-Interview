import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:"https://mock-master-backend.onrender.com",
    withCredentials:true
});
