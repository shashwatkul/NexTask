import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../api/profileApi";

function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setForm({
        name: response.data.name,
        email: response.data.email,
        password: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      setLoading(false);
      return;
    }

    try {
      await updateProfile(form);
      setMessage("Profile updated successfully!");
      
      // Update local storage so the dashboard reflects the new name instantly
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.name = form.name;
        user.email = form.email;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong while updating."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans">
      
      {/* NAVBAR */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">NexTask</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Account Settings</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2 border border-indigo-100"
          >
            <span>←</span> Back to Dashboard
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center pt-10 pb-20">
        
        {/* HEADER */}
        <div className="w-full max-w-2xl mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
            Profile Settings
          </h1>
          <p className="text-slate-500">
            Manage your personal information and account credentials.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* TOP SECTION (Gradient Header) */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-4xl font-bold shadow-lg">
                {form.name ? form.name[0].toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {form.name || "User"}
                </h2>
                <p className="text-indigo-100 mt-1 font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {form.email}
                </p>
              </div>
            </div>
          </div>

          {/* FORM SECTION */}
          <div className="p-8">
            
            {/* SUCCESS ALERT */}
            {message && (
              <div className="mb-8 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3.5 rounded-xl flex items-start gap-3 text-sm">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold">Success</p>
                  <p>{message}</p>
                </div>
              </div>
            )}

            {/* ERROR ALERT */}
            {error && (
              <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl flex items-start gap-3 text-sm">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* NAME INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* EMAIL INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter your email address"
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* PASSWORD INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter new password (optional)"
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Leave blank if you don't want to change your password.
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-200/50 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Profile...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;