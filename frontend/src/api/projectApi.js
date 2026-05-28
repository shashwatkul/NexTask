import API from "./axios";

export const createProject = (data) =>
  API.post("/projects/", data);

export const getProjects = (workspaceId) =>
  API.get(`/projects/${workspaceId}`);