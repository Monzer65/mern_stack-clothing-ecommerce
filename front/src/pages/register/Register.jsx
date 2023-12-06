import { useEffect, useRef, useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRegisterMutation } from "../../reducers/authApiSlice";

export default function Register() {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const [errMsg, setErrMsg] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);

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
      console.log(err?.data?.message || err.error);
      errRef.current.focus();
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, email, pwd, confirmPwd]);

  const errClass = errMsg ? "errmsg" : "offscreen";

  return (
    <>
      <div id='loginform-container'>
        <h2> Register </h2>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>{/* <MdAlternateEmail /> */}</label>
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
          <div className='form-group'>
            <label htmlFor='email'>{/* <MdAlternateEmail /> */}</label>
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
          <div className='form-group'>
            <label htmlFor='password'>{/* <MdOutlinePassword /> */}</label>
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

          <div className='form-group'>
            <label htmlFor='password2'>{/* <MdOutlinePassword /> */}</label>
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
            {isLoading ? (
              <div className='spinner-container'>
                <div className='spinner'></div>
              </div>
            ) : (
              <>
                Sign Up
                {/* <MdLogin /> */}
              </>
            )}
          </button>
        </form>

        <p className={errClass} ref={errRef} aria-live='assertive'>
          {errMsg}
        </p>

        <p className='register-link'>
          Already have an account? <br />
          <span className='line'>
            <Link to='/login'>Sign In</Link>
          </span>
        </p>
      </div>
    </>
  );
}
