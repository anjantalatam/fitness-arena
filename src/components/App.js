import "../App.css";
import NavBar from "./NavBar";
import { Route, Routes, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import Support from "./Support";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import NotFound from "./NotFound";
// import { useAuth } from "../hooks/useAuth";
import PrivateRoute from "./PrivateRoute";
import Arena from "./Arena";
import ProtectedRoute from "./ProtectedRoute";
import Team from "./Team";
import Teams from "./Teams";

function App() {
  // const { user } = useAuth();

  return (
    <div className="App">
      <CssBaseline />
      <NavBar />
      {/* <Typography>{user?.email}</Typography> */}
      <div className="body">
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/login" exact element={<Login />} />
            <Route path="/register" exact element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/arena" exact element={<Arena />} />
            <Route path="/teams" exact element={<Teams />} />
            <Route path="/team/:teamId" exact element={<Team />} />
            <Route path="/support" exact element={<Support />} />
          </Route>

          <Route exact path="/" element={<Home />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
