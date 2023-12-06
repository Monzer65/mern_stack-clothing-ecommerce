import { Outlet } from "react-router-dom";

// import { Link } from "react-router-dom";
export default function ProfileLayout() {
  return (
    <>
      <header>
        <p>Profile header</p>
      </header>
      <div>
        <Outlet />
      </div>
      <footer>
        <p>Profile footer</p>
      </footer>
    </>
  );
}
