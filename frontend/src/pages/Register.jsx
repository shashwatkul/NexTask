import {
  useState
} from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  registerUser
} from "../api/authApi";

// USER ICON
const UserIcon = () => (

  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />

  </svg>
);

function Register() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {

      setError(
        "All fields are required"
      );

      return;
    }

    if (form.password.length < 6) {

      setError(
        "Password must be at least 6 characters"
      );

      return;
    }

    setLoading(true);

    try {

      await registerUser(form);

      setSuccess(
        "Registration successful"
      );

      setTimeout(() => {

        navigate("/");

      }, 1500);

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

      <div className="max-w-md w-full">

        {/* ICON */}

        <div className="flex justify-center mb-6">

          <UserIcon />

        </div>

        {/* CARD */}

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">

          <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">

            Create Account

          </h1>

          <p className="text-center text-slate-500 mb-8">

            Join NexTask and start managing your work efficiently.

          </p>

          {/* SUCCESS */}

          {success && (

            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">

              {success}

            </div>

          )}

          {/* ERROR */}

          {error && (

            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">

              {error}

            </div>

          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Full Name

              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Email Address

              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Password

              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

             

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-70"
            >

              {loading
                ? "Creating Account..."
                : "Register"}

            </button>

            {/* LOGIN */}

            <p className="text-center text-sm text-slate-500 pt-2">

              Already have an account?{" "}

              <Link
                to="/"
                className="text-indigo-600 font-medium hover:text-indigo-500"
              >

                Login

              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Register;