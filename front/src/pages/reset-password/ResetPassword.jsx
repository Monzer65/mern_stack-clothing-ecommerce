import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../reducers/authApiSlice";
import { HiOutlineLockOpen } from "react-icons/hi2";
import {
  MdNumbers,
  MdPassword,
  MdOutlineConfirmationNumber,
} from "react-icons/md";

import styles from "./resetPassword.module.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [timer, setTimer] = useState(180);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [reset, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    if (state && state.email) {
      setEmail(state.email);
    } else {
      navigate("/forgot-password");
    }
  }, [state, navigate]);

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/");
  //   }
  // }, [token, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrMsg("Passwords do not match");
      return;
    }

    try {
      await reset({ email, verificationCode, password }).unwrap();
      navigate("/login");
    } catch (err) {
      console.log(err);
      setErrMsg(err?.data?.message || err.error);
    }
  };

  return (
    <div className={styles.container}>
      <h2> Reset your password </h2>

      <form onSubmit={handleSubmit}>
        <input type='hidden' id='email' name='email' value={email} readOnly />

        <div className={styles.formGroup}>
          <label htmlFor='verificationCode'>Enter the verification code</label>
          <div className={styles.icon}>
            <MdNumbers />
          </div>
          <input
            id='verificationCode'
            name='verificationCode'
            type='text'
            onChange={(e) => setVerificationCode(e.target.value)}
            value={verificationCode}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='password'>Enter new password</label>
          <div className={styles.icon}>
            <MdPassword />
          </div>
          <input
            id='password'
            name='password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='confirmPassword'>confirm new password</label>
          <div className={styles.icon}>
            <MdOutlineConfirmationNumber />
          </div>

          <input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          />
        </div>

        <p>{timer}</p>

        <button type='submit' disabled={isLoading}>
          <HiOutlineLockOpen />
          {isLoading ? "submitting..." : "Submit"}
        </button>
        <p className={`${styles.errmsg}`} ref={errRef} aria-live='assertive'>
          {errMsg}
        </p>

        {!timer && (
          <p className={styles.registerLink}>
            Did not receive the code? <br />
            <span className={styles.line}>
              <Link to='/'>Resend the code</Link>
            </span>
          </p>
        )}
      </form>
    </div>
  );
}
