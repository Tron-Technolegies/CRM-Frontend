import { useCallback, useEffect, useState } from "react";
import { getInvoices, deleteInvoice } from "../api/invoice";

export default function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (err) {
      console.error("FETCH INVOICES ERROR:", err);
      setError("Could not load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const removeInvoice = useCallback(async (id) => {
    await deleteInvoice(id);
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }, []);

  return { invoices, loading, error, refetch: fetchInvoices, removeInvoice };
}