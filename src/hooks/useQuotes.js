import { useState } from "react";
import {
  addQuote,
  getQuotes,
  getQuote,
  updateQuote,
  deleteQuote as deleteQuoteApi,
} from "../api/quotes";

const useQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [formData, setFormData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await getQuotes();
      setQuotes(data || []);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadQuote = async (id) => {
    try {
      setLoading(true);
      const data = await getQuote(id);
      setFormData(data);
      setEditId(id);
      return data;
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // payload is the already-mapped, backend-shaped object.
  // id defaults to whatever was loaded via loadQuote, but can be overridden.
  const saveQuote = async (payload, id = editId) => {
    try {
      setLoading(true);
      const response = id ? await updateQuote(id, payload) : await addQuote(payload);
      return response;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeQuote = async (id) => {
    try {
      setLoading(true);
      await deleteQuoteApi(id);
      await fetchQuotes();
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
    quotes,
    formData,
    editId,
    loading,
    error,
    fetchQuotes,
    loadQuote,
    saveQuote,
    removeQuote,
    resetForm,
  };
};

export default useQuotes;