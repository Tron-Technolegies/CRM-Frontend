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
    await createTask(taskData);
    await fetchTasks();
  };

  const editTask = async (id, taskData) => {
    await updateTask(id, taskData);
    await fetchTasks();
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
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