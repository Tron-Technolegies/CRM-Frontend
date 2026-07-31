import { useCallback, useEffect, useState } from "react";
import {
  getVendors,
  getVendor,
  createVendor as createVendorApi,
  updateVendor as updateVendorApi,
  deleteVendor as deleteVendorApi,
} from "../api/vendor";

// Manages the vendor list (fetch/add/update/delete) plus an on-demand
// single-vendor fetch for the Add/Edit page and the View modal.
export default function useVendor({ autoFetch = true } = {}) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState("");

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVendors();
      setVendors(data || []);
    } catch (err) {
      console.error("FETCH VENDORS ERROR:", err);
      setError("Could not load vendors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) fetchVendors();
  }, [autoFetch, fetchVendors]);

  const fetchVendorById = useCallback(async (id) => {
    return getVendor(id);
  }, []);

  const createVendor = useCallback(
    async (payload) => {
      await createVendorApi(payload);
      await fetchVendors();
    },
    [fetchVendors]
  );

  const editVendor = useCallback(
    async (id, payload) => {
      await updateVendorApi(id, payload);
      await fetchVendors();
    },
    [fetchVendors]
  );

  const removeVendor = useCallback(async (id) => {
    await deleteVendorApi(id);
    setVendors((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return {
    vendors,
    loading,
    error,
    fetchVendors,
    fetchVendorById,
    createVendor,
    editVendor,
    removeVendor,
  };
}