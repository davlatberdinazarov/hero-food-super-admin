import axios from "axios";

export const BASE_URL = `http://109.107.157.246`;

export const $axios = axios.create({
    baseURL: `${BASE_URL}/api`,
})


// http://185.219.81.112:8181
// http://localhost:8181
// http://109.107.157.246