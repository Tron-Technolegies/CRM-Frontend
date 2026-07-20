import api from "./Api";

export const getAccounts = () => {
    return api.get("/account/view/");
};


export const getStaff = () => {
    return api.get("/staff/view/");
};

export const deleteAccount = (id) => {
    return api.delete(`/account/delete/${id}/`);
};

export const createAccount = (data) => {
    return api.post("/account/add/", data);
};

export const updateAccount = (id, data) => {
    return api.post(`/account/update/${id}/`, data);
};