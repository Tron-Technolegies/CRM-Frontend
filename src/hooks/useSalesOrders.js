import { useState } from "react";
import {
  addSalesOrder,
  getSalesOrders,
  getSalesOrder,
  updateSalesOrder,
  deleteSalesOrder as deleteSalesOrderApi,
} from "../api/salesOrders";

const useSalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [formData, setFormData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSalesOrders = async () => {
    try {
      setLoading(true);
      const data = await getSalesOrders();
      setSalesOrders(data || []);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSalesOrder = async (id) => {
    try {
      setLoading(true);
      const data = await getSalesOrder(id);
      setFormData(data);
      setEditId(id);
      return data;
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSalesOrder = async (payload, id = editId) => {
    try {
      setLoading(true);
      const response = id ? await updateSalesOrder(id, payload) : await addSalesOrder(payload);
      return response;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeSalesOrder = async (id) => {
    try {
      setLoading(true);
      await deleteSalesOrderApi(id);
      await fetchSalesOrders();
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(null);
    setEditId(null);
  };

  return {
    salesOrders,
    formData,
    editId,
    loading,
    error,
    fetchSalesOrders,
    loadSalesOrder,
    saveSalesOrder,
    removeSalesOrder,
    resetForm,
  };
};

export default useSalesOrders;