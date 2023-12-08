import { MdAlternateEmail, MdOutlinePassword, MdLogin } from "react-icons/md";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../reducers/authSlice";
import { useLoginMutation } from "../../reducers/authApiSlice";
import LoadingSpinner from "../../componentss/spinners/LoadingSpinner";
import "./login.css";

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
  // const username = useSelector((state) => state.auth.username)

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

  const errClass = errMsg ? "errmsg" : "offscreen";

  return (
    <>
      <div id='loginform-container'>
        <h2> Login </h2>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
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
          <div className='form-group'>
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
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                Sign In <MdLogin />
              </>
            )}
          </button>
        </form>

        <p className={errClass} ref={errRef} aria-live='assertive'>
          {errMsg}
        </p>

        <p className='register-link'>
          Need an Account? <br />
          <span className='line'>
            <Link to='/register'>Sign Up</Link>
          </span>
        </p>
      </div>
    </>
  );
}
