import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceMembers,
  addMember,
  updateMemberRole,
  removeMember,
  deleteWorkspace,
} from "../api/workspaceApi";

function Workspaces() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [memberForm, setMemberForm] = useState({ email: "", role: "Member" });
  const [error, setError] = useState("");

  // Color arrays for dynamic styling
  const avatarGradients = [
    "from-indigo-500 to-blue-500",
    "from-purple-500 to-pink-500",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-red-500",
    "from-cyan-500 to-blue-600"
  ];

  const getRoleColors = (role) => {
    switch (role) {
      case "Owner": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Admin": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-teal-50 text-teal-700 border-teal-200";
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const response = await getWorkspaces();
      setWorkspaces(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMembers = async (workspaceId) => {
    try {
      if (selectedWorkspace === workspaceId) {
        setSelectedWorkspace(null);
        setMembers([]);
        return;
      }
      const response = await getWorkspaceMembers(workspaceId);
      setMembers(response.data);
      setSelectedWorkspace(workspaceId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (e) => {
    setMemberForm({ ...memberForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      await createWorkspace(form);
      setForm({ name: "", description: "" });
      fetchWorkspaces();
    } catch (error) {
      console.log(error);
      setError("Failed to create workspace");
    }
  };

  const handleAddMember = async (workspaceId) => {
    try {
      await addMember(workspaceId, memberForm);
      fetchMembers(workspaceId);
      setMemberForm({ email: "", role: "Member" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoleUpdate = async (memberId, role) => {
    try {
      await updateMemberRole(memberId, { role });
      setMembers(
        members.map((member) =>
          member.id === memberId ? { ...member, role } : member
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(memberId);
      setMembers(members.filter((member) => member.id !== memberId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workspace?"
    );
    if (!confirmDelete) return;

    try {
      await deleteWorkspace(workspaceId);
      fetchWorkspaces();
      if (selectedWorkspace === workspaceId) {
        setSelectedWorkspace(null);
        setMembers([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans">
      
      {/* NAVBAR */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">NexTask</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Workspace Management</p>
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
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 min-h-0">
        
        {/* LEFT COLUMN: Create Workspace */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6 flex-shrink-0 overflow-y-auto pr-1">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Workspaces</h2>
            <p className="text-sm text-slate-500 mt-1">Create and manage your team environments.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-5 flex items-center gap-2">
              <span className="text-indigo-500">+</span> New Workspace
            </h3>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                <span className="font-bold">!</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Workspace Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Marketing Campaign"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  name="description"
                  placeholder="What is this workspace for?"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Enhanced Gradient Button matching Dashboard */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white py-3 rounded-xl text-sm font-semibold transition-opacity shadow-md shadow-indigo-200/50 mt-2"
              >
                Create Workspace
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Workspace Grid */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-0">
          
          <div className="flex-shrink-0 px-6 py-5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Active Workspaces ({workspaces.length})</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {workspaces.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 text-2xl">
                  📂
                </div>
                <p>No workspaces found. Create one to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
                
                {workspaces.map((workspace, index) => {
                  const gradient = avatarGradients[index % avatarGradients.length];
                  const roleStyle = getRoleColors(workspace.role);
                  const isSelected = selectedWorkspace === workspace.id;

                  return (
                    <div
                      key={workspace.id}
                      className={`rounded-2xl border transition-all duration-200 flex flex-col ${
                        isSelected
                          ? "border-indigo-300 shadow-md bg-indigo-50/20"
                          : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md"
                      }`}
                    >
                      {/* WORKSPACE HEADER */}
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            onClick={() => navigate(`/projects/${workspace.id}`)}
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-bold shadow-sm cursor-pointer hover:scale-105 transition-transform`}
                            title="Open Workspace"
                          >
                            {workspace.name[0]?.toUpperCase()}
                          </div>
                          
                          {/* Colorful Role Badge */}
                          <span className={`text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border ${roleStyle}`}>
                            {workspace.role}
                          </span>
                        </div>

                        <div className="mb-2">
                          <h2
                            onClick={() => navigate(`/projects/${workspace.id}`)}
                            className="text-lg font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {workspace.name}
                          </h2>
                          <p className="text-slate-500 text-sm mt-1 line-clamp-2 min-h-[40px]">
                            {workspace.description}
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="p-4 border-t border-slate-100 bg-slate-50/80 rounded-b-2xl flex gap-2">
                        <button
                          onClick={() => fetchMembers(workspace.id)}
                          className={`flex-1 text-sm font-semibold py-2 rounded-xl transition-colors ${
                            isSelected
                              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
                          }`}
                        >
                          {isSelected ? "Close Members" : "Manage Members"}
                        </button>

                        {workspace.role === "Owner" && (
                          <button
                            onClick={() => handleDeleteWorkspace(workspace.id)}
                            className="w-10 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-red-500 rounded-xl flex items-center justify-center transition-colors"
                            title="Delete Workspace"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* EXPANDABLE MEMBERS SECTION */}
                      {isSelected && (
                        <div className="border-t border-indigo-100 bg-white p-5 rounded-b-2xl animate-in slide-in-from-top-2">
                          
                          <div className="mb-4 flex gap-2">
                            <input
                              type="email"
                              name="email"
                              placeholder="User email"
                              value={memberForm.email}
                              onChange={handleMemberChange}
                              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 bg-slate-50"
                            />
                            <select
                              name="role"
                              value={memberForm.role}
                              onChange={handleMemberChange}
                              className="w-24 border border-slate-200 bg-slate-50 rounded-lg px-2 text-sm focus:outline-none focus:border-indigo-400"
                            >
                              <option>Member</option>
                              <option>Admin</option>
                            </select>
                            <button
                              onClick={() => handleAddMember(workspace.id)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                            >
                              Add
                            </button>
                          </div>

                          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {members.map((member) => (
                              <div key={member.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                                <div className="overflow-hidden">
                                  <p className="text-xs font-bold text-slate-700 truncate">
                                    ID: {member.user_id}
                                  </p>
                                  <p className="text-[10px] text-slate-500 uppercase mt-0.5 font-medium">{member.role}</p>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <select
                                    defaultValue={member.role}
                                    onChange={(e) => handleRoleUpdate(member.id, e.target.value)}
                                    className="border border-slate-200 bg-white rounded flex-shrink-0 text-xs px-1.5 py-1 focus:outline-none focus:border-indigo-300 font-medium text-slate-600"
                                  >
                                    <option>Owner</option>
                                    <option>Admin</option>
                                    <option>Member</option>
                                  </select>
                                  <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition"
                                    title="Remove Member"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                            {members.length === 0 && (
                              <p className="text-xs text-center text-slate-500 py-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                No members found.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
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

export default Workspaces;