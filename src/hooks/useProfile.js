import { useState } from "react";
import { getProfile } from "../api/profile"

const useProfile = () => {
    const [profile, setProfile] = useState(null);

    const fetchProfile = async () => {
        try {
            const response = await getProfile();

            setProfile(response.data.data);

        } catch (error) {
            console.log(error);
        }
    };

    return {
        profile,
        fetchProfile,
    };
};

export default useProfile;