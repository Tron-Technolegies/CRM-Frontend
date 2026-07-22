import { useState } from "react";
import { signup, login } from "../api/auth"

const useAuth = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");



    const register = async (data) => {

        try {

            setLoading(true);
            setError("");

            const res = await signup(data);

            localStorage.setItem(
                "access_token",
                res.data.access
            );

            localStorage.setItem(
                "refresh_token",
                res.data.refresh
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            return res.data;


        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Signup failed"
            );

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


            localStorage.setItem(
                "access_token",
                res.data.access
            );


            localStorage.setItem(
                "refresh_token",
                res.data.refresh
            );


            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );


            return res.data;


        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Login failed"
            );

            throw err;

        } finally {

            setLoading(false);

        }

    };



    return {
        register,
        loginUser,
        loading,
        error,
        setError
    };

};


export default useAuth;