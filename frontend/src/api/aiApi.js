import API from "./axios";

export const enrichTask = (data) =>
  API.post(
    "/ai/enrich-task",
    data
  );