import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  useFetchUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
} from "../../reducers/profileApiSlice";
import { setCredentials } from "../../reducers/authSlice";
import LoadingSpinner from "../../componentss/spinners/LoadingSpinner";
import { GrUpdate } from "react-icons/gr";
import { FaRegTrashAlt } from "react-icons/fa";
import ConfirmationModal from "../../componentss/modal/ConfirmationModal";
import styles from "./Profile.module.css";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  const errRef = useRef();
  const successRef = useRef();

  const dispatch = useDispatch();

  const {
    data: userProfileData,
    isLoading,
    isError,
    refetch,
  } = useFetchUserProfileQuery();

  const [updateProfile] = useUpdateUserProfileMutation();

  const [deleteProfile] = useDeleteUserProfileMutation();

  useEffect(() => {
    refetch();
    if (userProfileData) {
      setUsername(userProfileData.username || "");
      setEmail(userProfileData.email || "");
      setAddress(userProfileData.address || "");
    }
  }, [userProfileData, refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setErrMsg("");
    setSuccessMsg("");

    if (pwd !== confirmPwd) {
      setErrMsg("Passwords do not match");
      return;
    }

    try {
      const response = await updateProfile({
        username,
        email,
        address,
        password: pwd,
      }).unwrap();

      const { username: updatedUsername } = response;

      dispatch(setCredentials({ username: updatedUsername }));
      // update localStorage ("username")
      // localStorage.setItem("username", JSON.stringify(updatedUsername));
      setErrMsg("");
      setSuccessMsg("Profile updated successfully!");
      refetch();
      successRef.current.focus();
      successRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setUpdateLoading(false);
    } catch (err) {
      setSuccessMsg("");
      setErrMsg(err?.data?.message || err.error);
      console.log(err?.data?.message || err.error);
      errRef.current.focus();
      errRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfile().unwrap();
      dispatch(setCredentials({}));
      setUsername("");
      setEmail("");
      setAddress("");
      setPwd("");
      setConfirmPwd("");
      setErrMsg("");
      setSuccessMsg("Profile deleted successfully!");
      console.log("Profile deleted successfully!");
      refetch();
    } catch (err) {
      setSuccessMsg("");
      setErrMsg(err?.data?.message || err.error);
      console.log(err?.data?.message || err.error);
      errRef.current.focus();
      errRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  // Function to handle confirming deletion
  const confirmDeletion = async () => {
    await handleDelete();
    setShowModal(false);
  };

  return (
    <div className={styles.profileContainer}>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <p>Error fetching profile data</p>
      ) : (
        <>
          <div className={styles.profile}>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor='username'>Username</label>
                <input
                  id='username'
                  name='username'
                  type='text'
                  autoComplete='off'
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  placeholder='Username'
                  key={userProfileData.username}
                />
              </div>
              <div className={styles.formGroup}>
                {/* <label htmlFor='email'>Email</label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='off'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder='Email'
                key={userProfileData.email}
              /> */}
                <div className={styles.email}>
                  <p>Email:</p>
                  <p>{userProfileData.email}</p>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='address'>Address</label>
                <input
                  id='address'
                  name='address'
                  type='text'
                  autoComplete='off'
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  placeholder='Address'
                  key={userProfileData.address}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='password'>Password</label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='off'
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  placeholder='Password'
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  autoComplete='off'
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  value={confirmPwd}
                  placeholder='Confirm Password'
                />
              </div>

              <button
                type='submit'
                onClick={handleSubmit}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <GrUpdate className={styles.spin} />
                ) : (
                  <>
                    <GrUpdate className={styles.update} /> Update
                  </>
                )}
              </button>

              <p
                ref={errRef}
                className={errMsg ? `${styles.errmsg}` : `${styles.offscreen}`}
              >
                {errMsg}
              </p>

              <p
                ref={successRef}
                className={
                  successMsg ? `${styles.successmsg}` : `${styles.offscreen}`
                }
              >
                {successMsg}
              </p>
            </form>
          </div>
          <div>
            <button className={styles.delete} onClick={handleShowModal}>
              <FaRegTrashAlt /> Delete Account
            </button>

            <ConfirmationModal
              isOpen={showModal}
              onCancel={() => setShowModal(false)}
              onConfirm={confirmDeletion}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
