import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../reducers/authSlice";
import { useVerifyMutation } from "../../reducers/authApiSlice";
import "./verify.css";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verify, { isLoading }] = useVerifyMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (state && state.email) {
      setEmail(state.email);
    }
  }, [state]);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await verify({ email, verificationCode }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      console.log(err);
      setErrMsg(err?.data?.message || err.error);
    }
  };

  return (
    <div id='loginform-container'>
      <h2> Verify </h2>

      <form onSubmit={handleSubmit}>
        <input type='hidden' id='email' name='email' value={email} readOnly />

        <div className='form-group'>
          <label htmlFor='verificationCode'></label>
          <input
            id='verificationCode'
            name='verificationCode'
            type='text'
            onChange={(e) => setVerificationCode(e.target.value)}
            value={verificationCode}
            placeholder='Enter Verification Code'
            required
          />
        </div>

        <button type='submit' disabled={isLoading}>
          {isLoading ? "submitting..." : "Submit"}
        </button>
      </form>

      <p className='errmsg' ref={errRef} aria-live='assertive'>
        {errMsg}
      </p>

      <p className='register-link'>
        Did not receive the code? <br />
        <span className='line'>
          <Link to='/'>Resend the code</Link>
        </span>
      </p>
    </div>
  );
}
