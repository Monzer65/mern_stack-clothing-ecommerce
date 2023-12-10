import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForgotPasswordMutation } from "../../reducers/authApiSlice";
import { MdOutlineRememberMe } from "react-icons/md";
import { MdAlternateEmail } from "react-icons/md";
import styles from "./forgotPassword.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const [forgot, { isLoading }] = useForgotPasswordMutation();
  const token = useSelector((state) => state.auth.token);
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await forgot({
        email,
      }).unwrap();
      setEmail("");
      navigate("/reset-password", { state: { email } });
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
  }, [email]);

  const errClass = errMsg ? `${styles.errmsg}` : `${styles.offscreen}`;

  return (
    <>
      <div className={styles.forgotPasswordContainer}>
        <h2> Forgot Password ?</h2>
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
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder='Email'
              required
            />
          </div>
          <button type='submit' disabled={isLoading}>
            <MdOutlineRememberMe />
            {isLoading ? (
              <>
                <div className='spinner-container'>
                  <div className='spinner'></div>
                </div>
                Sending code...
              </>
            ) : (
              <>Send code</>
            )}
          </button>
        </form>

        <p className={errClass} ref={errRef} aria-live='assertive'>
          {errMsg}
        </p>
      </div>
    </>
  );
}
