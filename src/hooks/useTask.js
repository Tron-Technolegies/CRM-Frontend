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
  };

  const editTask = async (id, taskData) => {
    await updateTask(id, taskData);
  };

  const removeTask = async (id) => {
    await deleteTask(id);
  };

  return {
    tasks,
    loading,
    addTask,
    editTask,
    removeTask,
    fetchTask,
  };
}