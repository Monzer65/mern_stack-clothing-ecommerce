/** @format */
import { MdAlternateEmail, MdOutlinePassword, MdLogin } from "react-icons/md";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../reducers/authSlice";
import { useLoginMutation } from "../reducers/authApiSlice";
import LoadingSpinner from "../componentss/LoadingSpinner";
export default function Login() {
  const userRef = useRef();
  const errRef = useRef();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email: user, password: pwd }).unwrap();
      dispatch(loginSuccess({ ...userData, user }));
      setUser("");
      setPwd("");
      navigate("/profile");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUser(e.target.value);

  const handlePwdInput = (e) => setPwd(e.target.value);

  const errClass = errMsg ? "errmsg" : "offscreen";

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div id="loginform-container">
          <h2> Login </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <MdAlternateEmail />
              </label>
              <input
                id="email"
                name="email"
                type="email"
                ref={userRef}
                autoComplete="off"
                onChange={handleUserInput}
                value={user}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <MdOutlinePassword />{" "}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={handlePwdInput}
                value={pwd}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit">
              Sign In <MdLogin />
            </button>
          </form>

          <p
            className={errClass}
            style={({ color: "rgb(220, 38, 38)" }, { textAlign: "center" })}
            ref={errRef}
            aria-live="assertive"
          >
            {errMsg}
          </p>
        </div>
      )}
    </>
  );
}
