import {
  useEffect,
  useState
} from "react";

import {
  getProfile,
  updateProfile
} from "../api/profileApi";

function Profile() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchProfile = async () => {

    try {

      const response =
        await getProfile();

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
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await updateProfile(form);

      alert("Profile updated");

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold mb-10">
        Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md max-w-xl"
      >

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mb-4"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={form.password}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mb-4"
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Update Profile
        </button>

      </form>

    </div>
  );
}

export default Profile;