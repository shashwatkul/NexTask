import API from "./axios";

export const generateStandup = () =>
  API.get(
    "/ai/generate-standup"
  );