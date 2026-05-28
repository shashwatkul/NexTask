import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateStandup } from "../api/standupApi";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [metrics, setMetrics] = useState({
    assigned_tasks: 0,
    upcoming_deadlines: 0,
    open_tasks: 0,
    overdue_tasks: 0,
    completed_tasks: 0,
    total_projects: 0,
    total_workspaces: 0,
  });

  const [standup, setStandup] = useState("");
  const [standupLoading, setStandupLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/dashboard/metrics",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMetrics(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(() => {
      fetchMetrics();
    }, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const handleGenerateStandup = async () => {
    try {
      setStandupLoading(true);
      const response = await generateStandup();
      setStandup(response.data.standup);
    } catch (error) {
      console.log(error);
      alert("Failed to generate standup");
    } finally {
      setStandupLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const metricCards = [
    { title: "Assigned", value: metrics.assigned_tasks, bg: "bg-blue-500" },
    { title: "Deadlines", value: metrics.upcoming_deadlines, bg: "bg-purple-500" },
    { title: "Open", value: metrics.open_tasks, bg: "bg-yellow-500" },
    { title: "Done", value: metrics.completed_tasks, bg: "bg-green-500" },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans">
      
      {/* NAVBAR */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">NexTask</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">AI Project Management</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors duration-200"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-500 hover:text-white text-red-600 font-medium px-4 py-2 rounded-lg text-sm transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col p-6 gap-6 min-h-0">
        
        {/* HEADER */}
        <div className="flex-shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Welcome, <span className="text-indigo-600">{user?.name || "User"}</span>
            </h2>
            
            {/* UPGRADED USER ID & OVERVIEW */}
            <div className="flex items-center gap-3 mt-1.5">
              <p className="text-sm text-slate-500">Productivity overview</p>
              <span className="text-slate-300">•</span>
              <button
                onClick={handleCopyId}
                title="Click to copy User ID"
                className="group flex items-center gap-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-500 hover:text-indigo-700 text-xs px-2.5 py-1 rounded-lg transition-all duration-200 shadow-sm"
              >
                <span className="font-semibold tracking-wide">ID: {user?.id}</span>
                {copied ? (
                  <span className="text-emerald-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </span>
                )}
              </button>
            </div>

          </div>
          <button
            onClick={handleGenerateStandup}
            disabled={standupLoading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-70 shadow-sm shadow-indigo-200 flex items-center gap-2"
          >
            {standupLoading ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              "✨ Generate AI Standup"
            )}
          </button>
        </div>

        {/* METRICS GRID */}
        <div className="flex-shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 transition-transform hover:-translate-y-0.5"
            >
              <div className={`w-12 h-12 rounded-xl flex-shrink-0 ${card.bg} flex items-center justify-center text-white text-lg shadow-inner`}>
                <span className="font-bold">{card.value}</span>
              </div>
              <div>
                <h3 className="text-xs text-slate-500 font-medium uppercase tracking-wider">{card.title}</h3>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* LOWER SPLIT LAYOUT */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          
          {/* LEFT COLUMN: Workspaces */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
              
              {/* Workspaces Title Header */}
              <div className="flex-shrink-0 mb-4">
                <h2 className="text-lg font-bold text-slate-800">Workspaces</h2>
                <p className="text-sm text-slate-500">Manage projects & teams</p>
              </div>

              {/* Informational Banner Container */}
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-700 mb-2">AI-Powered Collaboration</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                    Manage projects, create AI-generated tasks, automate standups, and collaborate efficiently using smart Kanban workflows.
                  </p>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => navigate("/workspaces")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-indigo-100 hover:shadow-indigo-200 flex items-center gap-2 group"
                  >
                    <span>Launch Workspaces</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: AI Standup & Insights */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-0">
            <h2 className="flex-shrink-0 text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>✨</span> Today's AI Standup
            </h2>
            
            {/* Scrollable Standup Area or Empty State */}
            {standup ? (
              <div className="flex-1 overflow-y-auto bg-indigo-50/30 rounded-xl border border-indigo-100 p-4 mb-4 shadow-inner">
                <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-sans">
                  {standup}
                </pre>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-xl mb-4 p-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm font-medium">No standup generated yet</p>
                <p className="text-slate-400 text-xs mt-1">Click the generate button above to get your daily summary.</p>
              </div>
            )}

            {/* Insight card */}
            <div className="flex-shrink-0 mt-auto">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-5 text-white shadow-md shadow-indigo-200">
                <h3 className="text-base font-bold mb-2 flex items-center gap-2">
                  💡 Productivity Insights
                </h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  AI enrichment, automated standups, smart prioritization, and collaborative workflows keep your team moving fast.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;