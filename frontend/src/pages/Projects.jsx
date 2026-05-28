import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProject, getProjects } from "../api/projectApi";

function Projects() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  // Color array for dynamic project avatars
  const avatarGradients = [
    "from-indigo-500 to-blue-500",
    "from-purple-500 to-pink-500",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-red-500",
    "from-cyan-500 to-blue-600"
  ];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects(workspaceId);
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [workspaceId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      await createProject({
        ...form,
        workspace_id: workspaceId,
      });

      setForm({
        name: "",
        description: "",
      });

      fetchProjects();
    } catch (error) {
      console.log(error);
      setError("Failed to create project");
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans">
      
      {/* NAVBAR */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">NexTask</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Project Management</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => navigate("/workspaces")}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2 border border-indigo-100"
          >
            <span>←</span> Back to Workspaces
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 min-h-0">
        
        {/* LEFT COLUMN: Create Project Form */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6 flex-shrink-0 overflow-y-auto pr-1">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Projects</h2>
            <p className="text-sm text-slate-500 mt-1">Manage workflow and collaborate.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-5 flex items-center gap-2">
              <span className="text-indigo-500">+</span> New Project
            </h3>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                <span className="font-bold">!</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Q3 Roadmap"
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="What is this project about?"
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white py-3 rounded-xl text-sm font-semibold transition-opacity shadow-md shadow-indigo-200/50 mt-2"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Project Grid */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-0">
          
          {/* Grid Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Active Projects ({projects.length})</h3>
          </div>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="font-medium">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 text-2xl">
                  📋
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">No Projects Yet</h3>
                <p className="text-sm">Create your first project to start managing tasks.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                {projects.map((project, index) => {
                  const gradient = avatarGradients[index % avatarGradients.length];

                  return (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/kanban/${project.id}`)}
                      className="group rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
                    >
                      {/* CARD CONTENT */}
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-bold shadow-sm group-hover:scale-105 transition-transform`}>
                            {project.name[0]?.toUpperCase()}
                          </div>
                          
                          {/* Active Badge */}
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                            Active
                          </span>
                        </div>

                        <div className="mb-2">
                          <h2 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {project.name}
                          </h2>
                          <p className="text-slate-500 text-sm mt-1 line-clamp-2 min-h-[40px]">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* CARD FOOTER */}
                      <div className="p-4 border-t border-slate-100 bg-slate-50/80 rounded-b-2xl flex justify-between items-center group-hover:bg-indigo-50/50 transition-colors">
                        <span className="text-sm font-semibold text-slate-500 group-hover:text-indigo-700 transition-colors">
                          Open Kanban Board
                        </span>
                        <span className="text-slate-300 group-hover:text-indigo-600 transition-all transform group-hover:translate-x-1 font-bold">
                          →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;