/** @format */

import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import { useSendLogoutMutation } from "../reducers/authApiSlice";

const DASH_REGEX = /^\/profile(\/)?$/;
// const NOTES_REGEX = /^\/profile\/notes(\/)?$/;
// const USERS_REGEX = /^\/profile\/users(\/)?$/;

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  if (isLoading) return <p>Logging Out...</p>;

  if (isError) return <p>Error: {error.data?.message}</p>;

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname)
    // !NOTES_REGEX.test(pathname) &&
    // !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <VscSignOut />
    </button>
  );

  return (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/profile">
          <h1 className="dash-header__title">techNotes</h1>
        </Link>
        <nav className="dash-header__nav">
          {/* add more buttons later */}
          {logoutButton}
        </nav>
      </div>
    </header>
  );
}
