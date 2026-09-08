import { useCallback, useState } from "react";
import {
  joinMeeting,
  joinMeetingAttendance,
  leaveMeetingAttendance,
} from "../api/meeting";

export default function useMeetingRoom() {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Authorize user and get JaaS JWT
  const authorizeMeeting = useCallback(async (meetingId) => {
    try {
      setLoading(true);
      setError("");

      const data = await joinMeeting(meetingId);

      console.log("JAAS JOIN AUTHORIZATION:", data);

      setMeeting(data);

      return data;
    } catch (err) {
      console.error("MEETING JOIN ERROR:", err);

      const message =
        err.response?.data?.message ||
        "You are not authorized to join this meeting.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Tell Django that the user actually entered the JaaS conference
  const startAttendance = useCallback(async (meetingId) => {
    try {
      const data = await joinMeetingAttendance(meetingId);

      console.log("MEETING ATTENDANCE STARTED:", data);

      return data;
    } catch (err) {
      console.error("ATTENDANCE JOIN ERROR:", err);
      throw err;
    }
  }, []);

  // Tell Django that the user left the JaaS conference
  const endAttendance = useCallback(async (meetingId) => {
    try {
      const data = await leaveMeetingAttendance(meetingId);

      console.log("MEETING ATTENDANCE ENDED:", data);

      return data;
    } catch (err) {
      console.error("ATTENDANCE LEAVE ERROR:", err);
      throw err;
    }
  }, []);

  const clearMeeting = useCallback(() => {
    setMeeting(null);
    setError("");
  }, []);

  return {
    meeting,
    loading,
    error,
    authorizeMeeting,
    startAttendance,
    endAttendance,
    clearMeeting,
  };
}