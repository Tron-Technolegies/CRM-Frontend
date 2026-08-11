import { useCallback, useEffect, useState } from "react";
import {
  getServices,
  getService,
  createService as createServiceApi,
  updateService as updateServiceApi,
  deleteService as deleteServiceApi,
} from "../api/service";

// Manages the service list (fetch/add/update/delete) plus an on-demand
// single-service fetch for the Add/Edit page and the View modal.
export default function useService({ autoFetch = true } = {}) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState("");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getServices();
      setServices(data || []);
    } catch (err) {
      console.error("FETCH SERVICES ERROR:", err);
      setError("Could not load services. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) fetchServices();
  }, [autoFetch, fetchServices]);

  const fetchServiceById = useCallback(async (id) => {
    return getService(id);
  }, []);

  const createService = useCallback(
    async (payload) => {
      await createServiceApi(payload);
      await fetchServices();
    },
    [fetchServices]
  );

  const editService = useCallback(
    async (id, payload) => {
      await updateServiceApi(id, payload);
      await fetchServices();
    },
    [fetchServices]
  );

  const removeService = useCallback(async (id) => {
    await deleteServiceApi(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    fetchServiceById,
    createService,
    editService,
    removeService,
  };
}