import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../api/taskApi";

import {
  addComment,
  getComments,
} from "../api/commentApi";

function Kanban() {

  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);

  const [comments, setComments] = useState({});

  const [commentInputs, setCommentInputs] = useState({});

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

  const fetchComments = async (
    taskId
  ) => {

    try {

      const response =
        await getComments(taskId);

      setComments((prev) => ({
        ...prev,
        [taskId]: response.data,
      }));

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    const loadData = async () => {

      try {

        const response =
          await getTasks(
            projectId,
            filters
          );

        setTasks(response.data);

        response.data.forEach(
          (task) => {
            fetchComments(task.id);
          }
        );

      } catch (error) {

        console.log(error);
      }
    };

    loadData();

  }, [filters]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {

    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createTask({
        ...form,
        project_id: projectId
      });

      setForm({
        title: "",
        description: "",
        priority: "Medium",
        due_date: "",
        assigned_to: "",
      });

      const response =
        await getTasks(
          projectId,
          filters
        );

      setTasks(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const moveTask = async (
    taskId,
    status
  ) => {

    try {

      await updateTask(
        taskId,
        { status }
      );

      const response =
        await getTasks(
          projectId,
          filters
        );

      setTasks(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const handleDelete = async (
    taskId
  ) => {

    try {

      await deleteTask(taskId);

      const response =
        await getTasks(
          projectId,
          filters
        );

      setTasks(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const handleCommentChange = (
    taskId,
    value
  ) => {

    setCommentInputs({
      ...commentInputs,
      [taskId]: value,
    });
  };

  const handleAddComment = async (
    taskId
  ) => {

    try {

      await addComment({
        content:
          commentInputs[taskId],
        task_id: taskId,
      });

      fetchComments(taskId);

      setCommentInputs({
        ...commentInputs,
        [taskId]: "",
      });

    } catch (error) {

      console.log(error);
    }
  };

  const columns = [
    "Todo",
    "In Progress",
    "Done"
  ];

  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold mb-10">
        Kanban Board
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md mb-10"
      >

        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mb-4"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mb-4"
        />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mb-4"
        >

          <option>Low</option>
          <option>Medium</option>
          <option>High</option>

        </select>

        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mb-4"
        />

        <input
          type="number"
          name="assigned_to"
          placeholder="Assign User ID"
          value={form.assigned_to}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mb-4"
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Create Task
        </button>

      </form>

      <div className="flex gap-4 mb-8">

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border p-3 rounded-lg"
        >

          <option value="">
            All Status
          </option>

          <option value="Todo">
            Todo
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Done">
            Done
          </option>

        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleFilterChange}
          className="border p-3 rounded-lg"
        >

          <option value="">
            All Priority
          </option>

          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>

        </select>

        <input
          type="number"
          name="assigned_to"
          placeholder="Assignee ID"
          value={filters.assigned_to}
          onChange={handleFilterChange}
          className="border p-3 rounded-lg"
        />

      </div>

      <div className="grid grid-cols-3 gap-6">

        {columns.map((column) => (

          <div
            key={column}
            className="bg-gray-100 rounded-2xl p-5 min-h-[500px]"
          >

            <h2 className="text-2xl font-bold mb-5">
              {column}
            </h2>

            {tasks
              .filter(
                (task) =>
                  task.status === column
              )
              .map((task) => (

                <div
                  key={task.id}
                  className="bg-white p-4 rounded-xl shadow-md mb-4"
                >

                  <h3 className="font-bold text-lg">
                    {task.title}
                  </h3>

                  <p className="text-gray-600 mb-3">
                    {task.description}
                  </p>

                  <span className="text-sm font-semibold block">
                    Priority: {task.priority}
                  </span>

                  <p className="text-sm mt-2">
                    Due: {task.due_date || "No deadline"}
                  </p>

                  <p className="text-sm">
                    Assignee: {task.assigned_to || "Unassigned"}
                  </p>

                  <div className="flex gap-2 mt-4">

                    {column !== "Todo" && (
                      <button
                        onClick={() =>
                          moveTask(
                            task.id,
                            "Todo"
                          )
                        }
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        Todo
                      </button>
                    )}

                    {column !== "In Progress" && (
                      <button
                        onClick={() =>
                          moveTask(
                            task.id,
                            "In Progress"
                          )
                        }
                        className="bg-yellow-300 px-3 py-1 rounded"
                      >
                        Progress
                      </button>
                    )}

                    {column !== "Done" && (
                      <button
                        onClick={() =>
                          moveTask(
                            task.id,
                            "Done"
                          )
                        }
                        className="bg-green-300 px-3 py-1 rounded"
                      >
                        Done
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDelete(task.id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                  <div className="mt-4">

                    <h4 className="font-semibold mb-2">
                      Comments
                    </h4>

                    <div className="space-y-2 mb-3">

                      {(comments[task.id] || []).map(
                        (comment) => (

                          <div
                            key={comment.id}
                            className="bg-gray-100 p-2 rounded"
                          >

                            <p className="text-sm">
                              {comment.content}
                            </p>

                            <span className="text-xs text-gray-500">
                              User {comment.user_id}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                    <div className="flex gap-2">

                      <input
                        type="text"
                        placeholder="Add comment"
                        value={
                          commentInputs[task.id] || ""
                        }
                        onChange={(e) =>
                          handleCommentChange(
                            task.id,
                            e.target.value
                          )
                        }
                        className="border p-2 rounded w-full text-sm"
                      />

                      <button
                        onClick={() =>
                          handleAddComment(task.id)
                        }
                        className="bg-blue-500 text-white px-3 rounded"
                      >
                        Add
                      </button>

                    </div>

                  </div>

                </div>

              ))}

          </div>

        ))}

      </div>

    </div>
  );
}

export default Kanban;