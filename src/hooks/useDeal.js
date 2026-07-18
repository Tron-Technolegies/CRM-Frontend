import { useEffect, useState } from "react";
import { getDeals } from "../api/deal";

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

  return {
    deals,
    loading,
    fetchDeals,
    setDeals,
  };
}