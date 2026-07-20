import { useEffect, useState } from "react";

import {
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "../api/meeting";

export default function useMeeting() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeeting = async (id) => {
    return await getMeeting(id);
  };

  const addMeeting = async (meeting) => {
    await createMeeting(meeting);
    await fetchMeetings();
  };

  const editMeeting = async (id, meeting) => {
    await updateMeeting(id, meeting);
    await fetchMeetings();
  };

  const removeMeeting = async (id) => {
    await deleteMeeting(id);
    await fetchMeetings();
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return {
    meetings,
    loading,
    fetchMeetings,
    fetchMeeting,
    addMeeting,
    editMeeting,
    removeMeeting,
  };
}