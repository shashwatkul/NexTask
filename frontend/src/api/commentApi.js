import API from "./axios";

export const addComment = (data) =>
  API.post("/comments", data);

export const getComments = (taskId) =>
  API.get(`/comments/${taskId}`);

export const updateComment = (
  commentId,
  data
) =>
  API.put(
    `/comments/${commentId}`,
    data
  );

export const deleteComment = (
  commentId
) =>
  API.delete(
    `/comments/${commentId}`
  );