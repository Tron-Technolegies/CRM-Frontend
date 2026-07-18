import { useEffect, useState } from "react";
import { getLeads, getStaff } from "../api/lead";

export default function useLead() {
  const [leads, setLeads] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (err) {
      console.error(err);
    }
  };

  const refresh = async () => {
    await Promise.all([
      fetchLeads(),
      fetchStaff(),
    ]);
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    leads,
    staff,
    loading,
    fetchLeads,
    fetchStaff,
    refresh,
    setLeads,
  };
}