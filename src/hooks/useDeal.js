import { useEffect, useState } from "react";
import {
  getDeals,
  getDeal,
  addDeal as addDealApi,
  updateDeal,
  deleteDeal,
} from "../api/deal";

export default function useDeal() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeal = async (id) => {
    return await getDeal(id);
  };

  const addDeal = async (dealData) => {
    const res = await addDealApi(dealData);
    fetchDeals();
    return res;
  };

  const editDeal = async (id, dealData) => {
    const res = await updateDeal(id, dealData);
    fetchDeals();
    return res;
  };

  const removeDeal = async (id) => {
    const res = await deleteDeal(id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
    return res;
  };

  return {
    deals,
    loading,
    fetchDeals,
    fetchDeal,
    addDeal,
    editDeal,
    removeDeal,
    setDeals,
  };
}