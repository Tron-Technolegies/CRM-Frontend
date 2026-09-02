import { useEffect, useState } from "react";

import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customer";

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomer = async (id) => {
    return await getCustomer(id);
  };

  const addCustomer = async (customerData) => {
    const res = await createCustomer(customerData);
    fetchCustomers();
    return res;
  };

  const editCustomer = async (id, customerData) => {
    const res = await updateCustomer(id, customerData);
    fetchCustomers();
    return res;
  };

  const removeCustomer = async (id) => {
    const res = await deleteCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    return res;
  };

  return {
    customers,
    loading,
    fetchCustomers,
    fetchCustomer,
    addCustomer,
    editCustomer,
    removeCustomer,
  };
}