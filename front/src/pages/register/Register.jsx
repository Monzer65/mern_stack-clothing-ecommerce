import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRegisterMutation } from "../../reducers/authApiSlice";
import { IoLockOpenOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdLogin, MdOutlineConfirmationNumber } from "react-icons/md";

import styles from "./register.module.css";
import { MdAlternateEmail, MdOutlinePassword } from "react-icons/md";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const token = useSelector((state) => state.auth.token);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pwd !== confirmPwd) {
      setErrMsg("Passwords do not match");
      return;
    }

    try {
      await register({
        username,
        email,
        password: pwd,
      }).unwrap();
      setEmail("");
      setPwd("");
      setUsername("");
      setConfirmPwd("");
      navigate("/verify", { state: { email } });
    } catch (err) {
      setErrMsg(err?.data?.message || err.error);
      errRef.current.focus();
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, email, pwd, confirmPwd]);

  const errClass = errMsg ? `${styles.errmsg}` : `${styles.offscreen}`;

  return (
    <>
      <div className={styles.container}>
        <h2> Register </h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor='username'>
              <FaRegCircleUser />
            </label>
            <input
              id='username'
              name='username'
              type='text'
              ref={userRef}
              autoComplete='off'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder='Username'
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='email'>
              <MdAlternateEmail />
            </label>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='off'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder='Email'
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='password'>
              <MdOutlinePassword />
            </label>
            <input
              id='password'
              name='password'
              type='password'
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              placeholder='Password'
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='password2'>
              <MdOutlineConfirmationNumber />
            </label>
            <input
              id='password2'
              name='password2'
              type='password'
              onChange={(e) => setConfirmPwd(e.target.value)}
              value={confirmPwd}
              placeholder='Confirm Password'
              required
            />
          </div>

          <button type='submit' disabled={isLoading}>
            <IoLockOpenOutline />
            {isLoading ? (
              <>
                <div className='spinner-container'>
                  <div className='spinner'></div>
                </div>
                Signing Up...
              </>
            ) : (
              <>Sign Up</>
            )}
          </button>
        </form>

        <p className={errClass} ref={errRef} aria-live='assertive'>
          {errMsg}
        </p>
        <hr />
        <p className={styles.registerLink}>
          Already have an account? <br />
          <span className={styles.line}>
            <Link to='/login'>
              <MdLogin /> Sign In
            </Link>
          </span>
        </p>
      </div>
    </>
  );
}
