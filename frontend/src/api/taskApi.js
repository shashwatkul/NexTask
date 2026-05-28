import API from "./axios";

export const createTask = (data) =>
  API.post("/tasks/", data);

export const getTasks = (
  projectId,
  filters,
  page = 1
) =>
  API.get(`/tasks/${projectId}`, {
    params: {
      ...filters,
      page,
    },
  });
  
export const updateTask = (
  taskId,
  data
) =>
  API.put(`/tasks/${taskId}`, data);

export const deleteTask = (taskId) =>
  API.delete(`/tasks/${taskId}`);