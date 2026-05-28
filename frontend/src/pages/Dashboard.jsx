import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="p-10">

      <div className="flex justify-between items-center mb-10">



        <h1 className="text-4xl font-bold">
          Welcome {user?.name}

          <div className="flex gap-4">

  <button
    onClick={() => navigate("/profile")}
    className="bg-blue-500 text-white px-5 py-2 rounded-lg"
  >
    Profile
  </button>

  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-5 py-2 rounded-lg"
  >
    Logout
  </button>

</div>
        </h1>


      </div>

      <div
        onClick={() => navigate("/workspaces")}
        className="bg-white p-10 rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition"
      >

        <h2 className="text-2xl font-bold">
          Open Workspaces
        </h2>

      </div>

    </div>
  );
}

export default Dashboard;