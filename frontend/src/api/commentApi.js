import API from "./axios";

export const addComment = (data) =>
  API.post("/comments", data);

export const getComments = (taskId) =>
  API.get(`/comments/${taskId}`);