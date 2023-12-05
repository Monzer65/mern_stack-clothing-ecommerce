/** @format */
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import ProfileLayout from "./componentss/profile/ProfileLayout";
import ProductsList from "./pages/ProductsList";

import RequireAuth from "./componentss/auth/RequireAuth";
import Welcome from "./pages/Welcome";

import PersistLogin from "./componentss/auth/PersistLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />

        <Route path="profile" element={<Welcome />}>
          {/* <Route path="profile" element={<ProfileLayout />}> */}
          {/* <Route
              index
              element={<div style={{ color: "red" }}>Profile</div>}
            /> */}
        </Route>

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="products">
              <Route index element={<ProductsList />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={<div style={{ color: "red" }}>Not Found</div>}
        />
      </Route>
    </Routes>
  );
}

export default App;
