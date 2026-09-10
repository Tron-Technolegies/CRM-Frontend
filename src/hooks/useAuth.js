import { useState } from "react";
import { signup, login, acceptInvitation } from "../api/auth";

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const extractErrorMessage = (err, fallbackMessage) => {
        if (!err) return fallbackMessage;
        const data = err.response?.data;
        if (!data) return err.message || fallbackMessage;
        if (typeof data === "string") return data;
        if (data.detail) return data.detail;
        if (data.message) return data.message;
        if (data.error) return data.error;
        if (typeof data === "object") {
            const values = Object.values(data).flat();
            if (values.length > 0 && typeof values[0] === "string") {
                return values.join(" ");
            }
        }
        return fallbackMessage;
    };

    const register = async (data) => {
        try {
            setLoading(true);
            setError("");
            const res = await signup(data);

            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            return res.data;
        } catch (err) {
            setError(extractErrorMessage(err, "Signup failed"));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (data) => {
        try {
            setLoading(true);
            setError("");
            const res = await login(data);

            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            return res.data;
        } catch (err) {
            setError(extractErrorMessage(err, "Login failed"));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const acceptStaffInvitation = async ({ token, password }, inviteDetails = {}) => {
        try {
            setLoading(true);
            setError("");
            const res = await acceptInvitation({ token, password });

            if (res.data?.access) {
                localStorage.setItem("access_token", res.data.access);
            }
            if (res.data?.refresh) {
                localStorage.setItem("refresh_token", res.data.refresh);
            }

            const userData = res.data?.user || {
                email: inviteDetails.email,
                full_name: inviteDetails.fullName || inviteDetails.full_name || inviteDetails.name,
                role: inviteDetails.role,
                department: inviteDetails.department,
                company_name: inviteDetails.companyName || inviteDetails.company_name,
            };

            if (userData) {
                localStorage.setItem("user", JSON.stringify(userData));
                if (userData.role) {
                    window.dispatchEvent(
                        new CustomEvent("authRoleChanged", { detail: { role: userData.role } })
                    );
                }
            }

            return res.data;
        } catch (err) {
            setError(extractErrorMessage(err, "Failed to accept invitation"));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        loginUser,
        acceptStaffInvitation,
        loading,
        error,
        setError
    };
};

export default useAuth;