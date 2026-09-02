import { useEffect, useState } from "react";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../api/task";

export default function useTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTask = async (id) => {
    return await getTask(id);
  };

  const addTask = async (taskData) => {
    const res = await createTask(taskData);
    fetchTasks();
    return res;
  };

  const editTask = async (id, taskData) => {
    const res = await updateTask(id, taskData);
    fetchTasks();
    return res;
  };

  const removeTask = async (id) => {
    const res = await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    return res;
  };

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    fetchTask,
  };
}