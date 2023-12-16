import { Outlet } from "react-router-dom";
import Header from "../componentss/header/Header";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <footer>
        <p>&copy; 2023 YourWebsite.com</p>
      </footer>
    </>
  );
}
