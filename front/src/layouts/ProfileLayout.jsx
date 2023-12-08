import { Outlet } from "react-router-dom";
import "./profileLayout.css";
// import { Link } from "react-router-dom";
export default function ProfileLayout() {
  return (
    <>
      <header>
        <h1>User Profile</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2023 YourWebsite.com</p>
      </footer>
    </>
  );
}
