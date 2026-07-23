import api from "./Api";

export const signup = (data) => {
    return api.post("staff/signup/", data);
};

export const login = (data) => {
    return api.post("staff/login/", data);
};

export const changePassword = (data) =>
    api.post("password/change/", data);

