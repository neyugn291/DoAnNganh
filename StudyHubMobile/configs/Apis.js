import axios from "axios";

const BASE_URL = "http://192.168.120.39:8000/api";

export const endpoints = {
    'categories': '/courses/categories/',
    'courses': '/courses/courses/',
    'lessons': '/courses/lessons/',

    'questions': '/discussions/questions/',
    'answers': '/discussions/answers/',
    'comments': '/discussions/comments/',
    'content_types':'/discussions/content_types/',
    'votes':'/discussions/votes/',

    'resources':'/resources/resources/',

    'quizzes':'/quizzes/quizzes/',
    'submissions':'/quizzes/submissions/',
 
    'currentUser': '/users/users/current/',
    'users':'/users/users/',
    'profiles':'/users/profiles/',
    'notifications':'/notifications/notifications/',
    'userDashboard':'/users/stats',

    'login': "/token/",
    'refresh': "/token/refresh/",
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