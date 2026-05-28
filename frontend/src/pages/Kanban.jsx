import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../api/taskApi";
import { enrichTask } from "../api/aiApi";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from "../api/commentApi";

function Kanban() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Moved up to fix initialization issue
  const [aiLoading, setAiLoading] = useState(false);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState([]);
  const [suggestedLabels, setSuggestedLabels] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assigned_to: "",
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
    assigned_to: "",
  });

  const fetchComments = async (taskId) => {
    try {
      const response = await getComments(taskId);
      setComments((prev) => ({
        ...prev,
        [taskId]: response.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks(projectId, filters, currentPage);
      setTasks(response.data.tasks);
      setTotalPages(response.data.total_pages);
      response.data.tasks.forEach((task) => {
        fetchComments(task.id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters, currentPage]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAiGenerate = async () => {
    if (!form.title.trim()) return alert("Enter task title first");
    
    try {
      setAiLoading(true);
      const response = await enrichTask({ title: form.title });
      const aiData = response.data;

      setForm((prev) => ({
        ...prev,
        description: aiData.description,
        priority: aiData.priority.charAt(0).toUpperCase() + aiData.priority.slice(1),
      }));
      setAcceptanceCriteria(aiData.acceptance_criteria || []);
      setSuggestedLabels(aiData.suggested_labels || []);
    } catch (error) {
      console.log(error);
      alert("AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      return alert("Please fill all required fields");
    }

    try {
      await createTask({ ...form, project_id: projectId });
      setForm({
        title: "",
        description: "",
        priority: "Medium",
        due_date: "",
        assigned_to: "",
      });
      setAcceptanceCriteria([]);
      setSuggestedLabels([]);
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const moveTask = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;
    try {
      await deleteTask(taskId);
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentChange = (taskId, value) => {
    setCommentInputs({ ...commentInputs, [taskId]: value });
  };

  const handleAddComment = async (taskId) => {
    if (!commentInputs[taskId]) return;
    try {
      await addComment({ content: commentInputs[taskId], task_id: taskId });
      fetchComments(taskId);
      setCommentInputs({ ...commentInputs, [taskId]: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateComment = async (commentId, taskId) => {
    try {
      await updateComment(commentId, { content: editContent });
      fetchComments(taskId);
      setEditingComment(null);
      setEditContent("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId, taskId) => {
    try {
      await deleteComment(commentId);
      fetchComments(taskId);
    } catch (error) {
      console.log(error);
    }
  };

  // Upgraded Column Styles
  const columns = [
    { title: "Todo", bg: "bg-slate-100/50", border: "border-slate-200", text: "text-slate-700", dot: "bg-slate-400" },
    { title: "In Progress", bg: "bg-amber-50/50", border: "border-amber-200", text: "text-amber-800", dot: "bg-amber-500" },
    { title: "Done", bg: "bg-emerald-50/50", border: "border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500" },
  ];

  const getPriorityColor = (priority) => {
    if (priority === "Critical") return "bg-red-100 text-red-700 border-red-200";
    if (priority === "High") return "bg-orange-100 text-orange-700 border-orange-200";
    if (priority === "Medium") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans">
      
      {/* NAVBAR */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">NexTask</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Kanban Board</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/projects/1")}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2 border border-indigo-100"
          >
            <span>←</span> Back to Projects
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-6 min-h-0">
        
        {/* LEFT SIDEBAR: CREATE TASK FORM */}
        <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 flex-shrink-0 min-h-0 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Add New Task</h2>
            <p className="text-xs text-slate-500 mt-1">Generate AI details or write manually.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Title & AI Generation */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Task Title</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Integrate payment gateway"
                    value={form.title}
                    onChange={handleChange}
                    className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={aiLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white px-4 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-200 disabled:opacity-70 flex items-center justify-center min-w-[100px]"
                  >
                    {aiLoading ? (
                      <span className="animate-pulse">Thinking...</span>
                    ) : (
                      "✨ Enrich"
                    )}
                  </button>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full border border-slate-300 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    value={form.due_date}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Task details..."
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Assign To (User ID)</label>
                <input
                  type="number"
                  name="assigned_to"
                  placeholder="e.g., 102"
                  value={form.assigned_to}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              {/* Dynamic AI Fields */}
              {(suggestedLabels.length > 0 || acceptanceCriteria.length > 0) && (
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-4">
                  {suggestedLabels.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-indigo-900 mb-2">Suggested Labels</p>
                      <div className="flex flex-wrap gap-1.5">
                        {suggestedLabels.map((label, i) => (
                          <span key={i} className="bg-white text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm">
                            #{label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {acceptanceCriteria.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-indigo-900 mb-2">Acceptance Criteria</p>
                      <ul className="space-y-1.5">
                        {acceptanceCriteria.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-indigo-800">
                            <span className="text-emerald-500 mt-0.5">✔</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-md"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT AREA: KANBAN BOARD */}
        <div className="flex-1 flex flex-col bg-slate-200/40 rounded-2xl border border-slate-200 overflow-hidden min-h-0">
          
          {/* Board Header & Pagination */}
          <div className="flex-shrink-0 p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Project Workflow</h2>
            
            <div className="flex items-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50 transition"
              >
                Prev
              </button>
              <span className="text-xs font-semibold text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </div>

          {/* Kanban Columns Container */}
          <div className="flex-1 overflow-x-auto p-4 lg:p-6 custom-scrollbar">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="font-medium">Loading board...</p>
              </div>
            ) : (
              <div className="flex gap-6 h-full min-h-0">
                {columns.map((column) => {
                  const columnTasks = tasks.filter((t) => t.status === column.title);
                  
                  return (
                    <div key={column.title} className={`w-[320px] lg:min-w-[340px] lg:flex-1 max-w-[420px] flex flex-col rounded-2xl border ${column.border} ${column.bg} overflow-hidden shadow-sm`}>
                      
                      {/* Column Header */}
                      <div className="flex-shrink-0 p-4 border-b border-black/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${column.dot}`}></span>
                          <h3 className={`font-bold ${column.text}`}>{column.title}</h3>
                        </div>
                        <span className="bg-white/60 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                          {columnTasks.length}
                        </span>
                      </div>

                      {/* Scrollable Column Content */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                        {columnTasks.map((task) => (
                          <div key={task.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                            
                            {/* Card Content */}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
                                  {task.title}
                                </h4>
                                <button
                                  onClick={() => handleDelete(task.id)}
                                  className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0"
                                  title="Delete Task"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>

                              <div className="flex gap-2 mb-3">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>

                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                                {task.description}
                              </p>

                              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                  <span>📅</span> {task.due_date || "No date"}
                                </div>
                                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                  <span>👤</span> {task.assigned_to ? `ID: ${task.assigned_to}` : "Unassigned"}
                                </div>
                              </div>
                            </div>

                            {/* Move Actions Footer */}
                            <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                              {column.title === "Todo" && (
                                <button onClick={() => moveTask(task.id, "In Progress")} className="flex-1 text-xs py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold rounded-lg transition-colors border border-indigo-100">
                                  Start Work →
                                </button>
                              )}
                              {column.title === "In Progress" && (
                                <>
                                  <button onClick={() => moveTask(task.id, "Todo")} className="flex-1 text-xs py-1.5 bg-white text-slate-600 hover:bg-slate-100 font-semibold rounded-lg transition-colors border border-slate-200">
                                    ← Pause
                                  </button>
                                  <button onClick={() => moveTask(task.id, "Done")} className="flex-1 text-xs py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-lg transition-colors border border-emerald-100">
                                    Complete ✔
                                  </button>
                                </>
                              )}
                              {column.title === "Done" && (
                                <button onClick={() => moveTask(task.id, "In Progress")} className="flex-1 text-xs py-1.5 bg-white text-slate-600 hover:bg-slate-100 font-semibold rounded-lg transition-colors border border-slate-200">
                                  ← Reopen
                                </button>
                              )}
                            </div>

                            {/* Comments Section (Collapsible style inside card) */}
                            <div className="border-t border-slate-100 p-3 bg-white rounded-b-xl">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Comments</p>
                              
                              <div className="space-y-2 mb-3 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                {(comments[task.id] || []).map((comment) => (
                                  <div key={comment.id} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                                    {editingComment === comment.id ? (
                                      <div>
                                        <input
                                          type="text"
                                          value={editContent}
                                          onChange={(e) => setEditContent(e.target.value)}
                                          className="w-full text-xs border border-indigo-300 rounded px-2 py-1 mb-2 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
                                        />
                                        <div className="flex gap-1.5">
                                          <button onClick={() => handleUpdateComment(comment.id, task.id)} className="bg-indigo-500 text-white text-[10px] px-2 py-1 rounded">Save</button>
                                          <button onClick={() => setEditingComment(null)} className="bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded">Cancel</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <div className="flex justify-between items-start mb-1">
                                          <span className="text-[10px] font-bold text-indigo-900">User {comment.user_id}</span>
                                          {String(comment.user_id) === String(currentUser.id) && (
                                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button onClick={() => { setEditingComment(comment.id); setEditContent(comment.content); }} className="text-indigo-400 hover:text-indigo-600 text-[10px]">Edit</button>
                                              <button onClick={() => handleDeleteComment(comment.id, task.id)} className="text-red-400 hover:text-red-600 text-[10px]">Del</button>
                                            </div>
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-600 leading-snug break-words">{comment.content}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {(comments[task.id] || []).length === 0 && (
                                  <p className="text-[10px] text-slate-400 italic">No comments yet.</p>
                                )}
                              </div>

                              {/* Comment Input */}
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  placeholder="Write a comment..."
                                  value={commentInputs[task.id] || ""}
                                  onChange={(e) => handleCommentChange(task.id, e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(task.id)}
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
                                />
                                <button
                                  onClick={() => handleAddComment(task.id)}
                                  className="bg-slate-800 hover:bg-slate-900 text-white rounded-lg px-2.5 flex items-center justify-center transition-colors"
                                  title="Send Comment"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {columnTasks.length === 0 && (
                          <div className="h-24 flex items-center justify-center border-2 border-dashed border-black/5 rounded-xl">
                            <p className="text-xs text-slate-400 font-medium">No tasks here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Adding a global style block for the custom thin scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default Kanban;