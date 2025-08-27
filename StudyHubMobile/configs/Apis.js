import axios from "axios";

const BASE_URL = "http://192.168.120.23:8000/api";

export const endpoints = {
    'categories': '/courses/categories/',
    'courses': '',
    'currentUser': '/users/users/current/',
    'login': "/token/",          // endpoint Simple JWT
    'refresh': "/token/refresh/", // refresh token nếu cần
};

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export default axios.create({
    baseURL: BASE_URL,
});