import {
  MdAlternateEmail,
  MdOutlinePassword,
  MdLogin,
  MdOutlineLockReset,
} from "react-icons/md";
import { IoLockOpenOutline } from "react-icons/io5";

import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../reducers/authSlice";
import { useLoginMutation } from "../../reducers/authApiSlice";
import LoadingSpinner from "../../componentss/spinners/LoadingSpinner";
import styles from "./Login.module.css";

export default function Login() {
  const userRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...userData }));

      console.log({ ...userData });
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.originalStatus === 429) {
        setErrMsg(err?.data);
      } else {
        setErrMsg(err?.data?.message || err.error);
      }
      console.log(err);
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setEmail(e.target.value);

  const handlePasswordInput = (e) => setPassword(e.target.value);

  const errClass = errMsg ? `${styles.errmsg}` : `${styles.offscreen}`;

  return (
    <>
      <div className={styles.loginformContainer}>
        <h2> Login </h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor='email'>
              <MdAlternateEmail />
            </label>
            <input
              id='email'
              name='email'
              type='email'
              ref={userRef}
              autoComplete='off'
              onChange={handleUserInput}
              value={email}
              placeholder='Email'
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='password'>
              <MdOutlinePassword />{" "}
            </label>
            <input
              id='password'
              name='password'
              type='password'
              onChange={handlePasswordInput}
              value={password}
              placeholder='Password'
              required
            />
          </div>

          <button type='submit' disabled={isLoading}>
            <MdLogin />
            {isLoading ? (
              <>
                <LoadingSpinner /> Signin In...
              </>
            ) : (
              <>Sign In</>
            )}
          </button>
        </form>

        <p className={errClass} ref={errRef} aria-live='assertive'>
          {errMsg}
        </p>
        <hr />
        <div className={styles.registerReset}>
          <p className={styles.registerLink}>
            Need an Account? <br />
            <span className={styles.line}>
              <Link to='/register'>
                <IoLockOpenOutline /> Sign Up
              </Link>
            </span>
          </p>
          <div className={styles.divider}></div>
          <p className={styles.registerLink}>
            Forgot your password? <br />
            <span className={styles.line}>
              <Link to='/forgot-password'>
                <MdOutlineLockReset /> Reset Password
              </Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
