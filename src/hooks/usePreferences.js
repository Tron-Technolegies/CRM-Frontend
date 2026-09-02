import { useEffect, useState } from "react";

import {
  getPicklistOptions,
  createPicklistOption,
  updatePicklistOption,
  deletePicklistOption,
} from "../api/preferences";

export default function usePreferences(field) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = async () => {
    setLoading(true);

    try {
      const data = await getPicklistOptions(field);
      setOptions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (field) {
      fetchOptions();
    }
  }, [field]);

  const addOption = async (payload) => {
    const res = await createPicklistOption(payload);
    fetchOptions();
    return res;
  };

  const editOption = async (id, payload) => {
    const res = await updatePicklistOption(id, payload);
    fetchOptions();
    return res;
  };

  const removeOption = async (id) => {
    const res = await deletePicklistOption(id);
    setOptions((prev) => prev.filter((o) => o.id !== id));
    fetchOptions();
    return res;
  };

  return {
    options,
    loading,
    addOption,
    editOption,
    removeOption,
  };
}