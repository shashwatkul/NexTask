import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    setIsLoading(true);

    setErrorMessage("");

    try {

      const response =
        await loginUser({
          email,
          password
        });

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      navigate("/dashboard");

    } catch (error) {

      const msg =
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";

      setErrorMessage(msg);

    } finally {

      setIsLoading(false);
    }
  };

  return (
  <div
    className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 via-white to-purple-100 relative overflow-hidden"
    style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}
  >
    {/* Background Blur Effects */}

    <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

    <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

    {/* LOGIN CARD */}

    <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 sm:p-10">
      
      {/* Logo */}

      <div className="flex flex-col items-center mb-8">

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg mb-4">
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>

        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Sign in to continue to NexTask
        </p>

      </div>

      {/* ERROR */}

      {errorMessage && (
        <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >

        {/* EMAIL */}

        <div>

          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            placeholder="Enter your email"
            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

        </div>

        {/* PASSWORD */}

        <div>

          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Password
          </label>

          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              value={password}
              placeholder="Enter your password"
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="button"
              className="absolute inset-y-0 right-4 flex items-center text-sm font-medium text-indigo-500 hover:text-indigo-700"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

        </div>

        {/* FORGOT PASSWORD */}

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Forgot Password?
          </button>
        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-70"
        >
          {isLoading
            ? "Authenticating..."
            : "Sign In"}
        </button>

        {/* REGISTER */}

        <p className="text-center text-sm text-gray-500 pt-4">

          Don’t have an account?{" "}

          <Link
            to="/register"
            className="font-bold text-indigo-600 hover:text-indigo-500"
          >
            Create one
          </Link>

        </p>

      </form>

    </div>
  </div>
);
}

export default Login;