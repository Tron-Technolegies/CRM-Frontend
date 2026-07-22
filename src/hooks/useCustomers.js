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
    await createCustomer(customerData);
    await fetchCustomers();
  };

  const editCustomer = async (id, customerData) => {
    await updateCustomer(id, customerData);
    await fetchCustomers();
  };

  const removeCustomer = async (id) => {
    await deleteCustomer(id);
    await fetchCustomers();
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