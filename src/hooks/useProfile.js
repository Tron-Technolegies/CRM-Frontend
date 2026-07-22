import { useState } from "react";


const useProfile = () => {

    const [profile, setProfile] = useState(null);


    const fetchProfile = async () => {

        try {

            const response = await getProfile();

            setProfile(response.data);

        } catch (error) {

            console.log(error);

        }

    };


    return {
        profile,
        fetchProfile
    };

};


export default useProfile;