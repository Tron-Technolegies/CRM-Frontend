import api from "./Api";

export const signup = (data) => {
    return api.post("staff/signup/", data);
};

export const login = (data) => {
    return api.post("staff/login/", data);
};

export const changePassword = (data) =>
    api.post("password/change/", data);

export const verifyInvitation = (token) => {
    return api.get("staff/verify-invitation/", {
        params: { token },
    });
};

export const acceptInvitation = ({ token, password }) => {
    return api.post("staff/acceptinvitation/", { token, password });
};

