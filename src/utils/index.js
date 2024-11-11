import axios from "axios";

export const BASE_URL = `http://185.219.81.112:8181`;

export const $axios = axios.create({
    baseURL: `${BASE_URL}/api`,
})
