import { useEffect, useState } from "react";
import {
  getDeals,
  getDeal,
  addDeal,
  updateDeal,
  deleteDeal,
} from "../api/deal";

export default function useDeal() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(data);
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
    await createDeal(dealData);
    await fetchDeals();
  };

  const editDeal = async (id, dealData) => {
    await updateDeal(id, dealData);
    await fetchDeals();
  };

  const removeDeal = async (id) => {
    await deleteDeal(id);
    await fetchDeals();
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