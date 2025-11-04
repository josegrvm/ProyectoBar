import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true, // 👈 necesario para mandar/recibir cookie
});
