import { useEffect, useState } from "react";
import {
  getLeads,
  getLead,
  addLead,
  updateLead,
  deleteLead,
  getStaff,
} from "../api/lead";

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

  const fetchLead = async (id) => {
    return await getLead(id);
  };

  const addLead = async (leadData) => {
    await createLead(leadData);
    await fetchLeads();
  };

  const editLead = async (id, leadData) => {
    await updateLead(id, leadData);
    await fetchLeads();
  };

  const removeLead = async (id) => {
    await deleteLead(id);
    await fetchLeads();
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
    fetchLead,
    fetchStaff,
    refresh,
    addLead,
    editLead,
    removeLead,
    setLeads,
  };
}