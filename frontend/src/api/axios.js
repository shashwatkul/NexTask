import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

API.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem(
            "refresh_token"
          );

        const response =
          await axios.post(
            "http://127.0.0.1:5000/api/auth/refresh",
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${refreshToken}`,
              },
            }
          );

        const newAccessToken =
          response.data.access_token;

        localStorage.setItem(
          "token",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return API(originalRequest);

      } catch (refreshError) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        localStorage.removeItem(
          "user"
        );

        window.location.href = "/";

        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);

export default API;