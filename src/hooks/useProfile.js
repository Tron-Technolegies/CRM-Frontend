import { useCallback, useState } from "react";
import { getProfile, updateProfile } from "../api/profile";

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      console.error("FETCH PROFILE ERROR:", err);
      setError("Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (payload) => {
    const data = await updateProfile(payload);
    setProfile(data);
    return data;
  }, []);

  return { profile, loading, error, fetchProfile, saveProfile };
}