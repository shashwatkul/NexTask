import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import {
  createProject,
  getProjects,
} from "../api/projectApi";

function Projects() {

  const { workspaceId } = useParams();

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchProjects = async () => {

    try {

      const response = await getProjects(
        workspaceId
      );

      console.log(response.data);

      setProjects(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchProjects();

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

      await createProject({
        ...form,
        workspace_id: workspaceId
      });

      setForm({
        name: "",
        description: "",
      });

      fetchProjects();

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold mb-10">
        Projects
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md mb-10"
      >

        <input
          type="text"
          name="name"
          placeholder="Project name"
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
          Create Project
        </button>

      </form>

      <div className="grid grid-cols-3 gap-6">

        {projects.map((project) => (
<div
  key={project.id}
  onClick={() =>
    navigate(`/kanban/${project.id}`)
  }
  className="bg-white p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition"
>

            <h2 className="text-2xl font-bold mb-2">
              {project.name}
            </h2>

            <p className="text-gray-600">
              {project.description}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Projects;