import api from "./Api";

export const getProfile = () =>
    api.get("profile/view/");