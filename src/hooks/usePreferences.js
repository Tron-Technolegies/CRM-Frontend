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
    await createPicklistOption(payload);
    await fetchOptions();
  };

  const editOption = async (id, payload) => {
    await updatePicklistOption(id, payload);
    await fetchOptions();
  };

  const removeOption = async (id) => {
    await deletePicklistOption(id);
    await fetchOptions();
  };

  return {
    options,
    loading,
    addOption,
    editOption,
    removeOption,
  };
}