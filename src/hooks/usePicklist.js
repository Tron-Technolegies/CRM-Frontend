import { useEffect, useState } from "react";
import api from "../api/Api";

export function usePicklist(field) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    api.get(`/picklists/view/?field=${field}`)
      .then((res) => setOptions(res.data))
      .catch((err) => console.error(`Failed to fetch ${field} options:`, err));
  }, [field]);

  return options;
}