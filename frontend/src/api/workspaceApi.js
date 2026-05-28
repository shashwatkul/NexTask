import API from "./axios";

export const createWorkspace = (data) =>
  API.post("/workspaces/", data);

export const getWorkspaces = () =>
  API.get("/workspaces/");