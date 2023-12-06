import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ProfileLayout from "./layouts/ProfileLayout";
import ProductsList from "./pages/ProductsList";
import RequireAuth from "./componentss/auth/RequireAuth";
import PersistLogin from "./componentss/auth/PersistLogin";
import NotFound from "./pages/not-found/NotFound";
import Profile from "./pages/profile/Profile";
import Verify from "./pages/verify/Verify";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* public routes */}
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='verify' element={<Verify />} />
        <Route path='products'>
          <Route index element={<ProductsList />} />
        </Route>

        {/* private routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path='profile' element={<ProfileLayout />}>
              <Route index element={<Profile />} />
            </Route>
          </Route>
        </Route>

        {/* catch all */}
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
