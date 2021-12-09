import NavBar from "./NavBar";
import { Route, Routes, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import Support from "./Support";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import NotFound from "./NotFound";

function App() {
  return (
    <>
      <CssBaseline />
      <NavBar />
      <div className="body">
        <Routes>
          <Route path="/login" exact element={<Login />}></Route>
          <Route path="/register" exact element={<Register />}></Route>
          <Route path="/support" exact element={<Support />}></Route>
          {/* <Route path="/demo" exact  element={Demo} /> */}
          <Route exact path="/" element={<Home />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
