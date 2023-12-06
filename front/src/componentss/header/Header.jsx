import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../../reducers/authApiSlice";
import LoadingSpinner from "../spinners/LoadingGrid";
import {
  IoLogInOutline,
  IoLogOutOutline,
  IoLockClosedOutline,
  IoArrowDownCircleOutline,
} from "react-icons/io5";
import { useSelector } from "react-redux";

import "./header.css";
export default function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  const userInfo = useSelector((state) => state.auth.userInfo);

  const handleItemClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  if (isLoading) return <LoadingSpinner />;

  if (isError) return <p>Error: {error.data?.message}</p>;

  const logoutButton = (
    <button className='icon-button' title='Logout' onClick={sendLogout}>
      <IoLogOutOutline /> Logout
    </button>
  );

  const registerButton = (
    <Link to='/register'>
      <button className='icon-button'>
        <IoLockClosedOutline /> Register
      </button>
    </Link>
  );

  const loginButton = (
    <Link to='/login'>
      <button className='icon-button'>
        <IoLogInOutline /> Login
      </button>
    </Link>
  );

  return (
    <header className='header'>
      <Link to='/' className='header__logo-link'>
        <h1 className='header__title'>LOGO</h1>
      </Link>
      <nav className='header__nav'>
        {userInfo ? (
          <>
            <div className='dropdown' ref={dropdownRef}>
              <input
                type='checkbox'
                id='dropdown-toggle'
                className='dropdown-toggle'
                checked={isOpen}
                onChange={() => setIsOpen(!isOpen)}
              />
              <label htmlFor='dropdown-toggle' className='dropdown-label'>
                welcome {userInfo.username} <IoArrowDownCircleOutline />
              </label>
              {isOpen && (
                <ul className='dropdown-menu'>
                  <li onClick={handleItemClick}>
                    <Link to='/profile'>Profile</Link>
                  </li>
                  <li onClick={handleItemClick}>{logoutButton}</li>
                </ul>
              )}
            </div>
          </>
        ) : (
          <>
            {loginButton}
            {registerButton}
          </>
        )}
      </nav>
    </header>
  );
}
