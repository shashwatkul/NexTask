import API from "./axios";

export const getProfile = () =>
  API.get("/profile");

export const updateProfile = (data) =>
  API.put("/profile", data);