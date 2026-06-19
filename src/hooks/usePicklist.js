import { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/api/admin" });

export function usePicklist(field) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    api.get(`/picklists/view/?field=${field}`)
      .then((res) => setOptions(res.data))
      .catch((err) => console.error(`Failed to fetch ${field} options:`, err));
  }, [field]);

  return options;
}