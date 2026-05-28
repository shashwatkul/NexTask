import { useEffect, useState } from "react";

import {
  createWorkspace,
  getWorkspaces,
} from "../api/workspaceApi";

function Workspaces() {

  const [workspaces, setWorkspaces] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchWorkspaces = async () => {

    try {

      const response = await getWorkspaces();

      setWorkspaces(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchWorkspaces();

  }, []);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createWorkspace(form);

      setForm({
        name: "",
        description: "",
      });

      fetchWorkspaces();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold">
          Workspaces
        </h1>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md mb-10"
      >

        <input
          type="text"
          name="name"
          placeholder="Workspace name"
          value={form.name}
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

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Create Workspace
        </button>

      </form>

      <div className="grid grid-cols-3 gap-6">

        {workspaces.map((workspace) => (

          <div
            key={workspace.id}
            className="bg-white p-6 rounded-2xl shadow-md"
          >

            <h2 className="text-2xl font-bold mb-2">
              {workspace.name}
            </h2>

            <p className="text-gray-600">
              {workspace.description}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Workspaces;