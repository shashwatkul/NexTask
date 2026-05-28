import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workspaces from "./pages/Workspaces";
import Projects from "./pages/Projects";
import Kanban from "./pages/Kanban";
import Profile from "./pages/Profile";


import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspaces"
          element={
            <ProtectedRoute>
              <Workspaces />
            </ProtectedRoute>
          }
        />

        <Route
           path="/projects/:workspaceId"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
  path="/kanban/:projectId"
  element={
    <ProtectedRoute>
      <Kanban />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={<Profile />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;