import { useState } from "react";
import {
  addPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder as deletePurchaseOrderApi,
} from "../api/purchaseOrders";

const usePurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [formData, setFormData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseOrders();
      setPurchaseOrders(data || []);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPurchaseOrder = async (id) => {
    try {
      setLoading(true);
      const data = await getPurchaseOrder(id);
      setFormData(data);
      setEditId(id);
      return data;
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePurchaseOrder = async (payload, id = editId) => {
    try {
      setLoading(true);
      const response = id ? await updatePurchaseOrder(id, payload) : await addPurchaseOrder(payload);
      return response;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removePurchaseOrder = async (id) => {
    try {
      setLoading(true);
      await deletePurchaseOrderApi(id);
      await fetchPurchaseOrders();
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
    purchaseOrders,
    formData,
    editId,
    loading,
    error,
    fetchPurchaseOrders,
    loadPurchaseOrder,
    savePurchaseOrder,
    removePurchaseOrder,
    resetForm,
  };
};

export default usePurchaseOrders;