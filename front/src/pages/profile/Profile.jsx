import { useEffect } from "react";
import {
  useFetchUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../../reducers/profileApiSlice";

const Profile = () => {
  // Fetch user profile data hook
  const {
    data: userProfileData,
    isLoading,
    isError,
    refetch,
  } = useFetchUserProfileQuery();

  // Update user profile data hook
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  useEffect(() => {
    // Fetch user profile data when the component mounts
    refetch();
  }, [refetch]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      // Make an API call to update user profile data
      const { data } = await updateProfile(updatedData);

      // Handle successful profile update, if needed
      console.log("Profile updated:", data);
    } catch (error) {
      // Handle errors, if any
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading profile...</p>
      ) : isError ? (
        <p>Error fetching profile data</p>
      ) : (
        <div>
          {/* Display user profile data */}
          <p>Username: {userProfileData.username}</p>
          <p>Email: {userProfileData.email}</p>
          <p>Address: {userProfileData.address}</p>

          {/* Update profile form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedData = {
                // Collect updated profile data from form fields
                // For example: username, email, address, etc.
              };
              handleUpdateProfile(updatedData);
            }}
          >
            {/* Form fields for updating profile */}
            {/* ... */}
            <button type='submit' disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;

// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useUpdateMutation } from "../../reducers/authApiSlice";
// import { setCredentials } from "../../reducers/authSlice";
// import "./profile.css";

// export default function Profile() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [address, setAddress] = useState("");
//   const [pwd, setPwd] = useState("");
//   const [confirmPwd, setConfirmPwd] = useState("");

//   const userRef = useRef();
//   const errRef = useRef();
//   const successRef = useRef();

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [updateProfile, { isLoading, isSuccess }] = useUpdateMutation();
//   const userInfo = useSelector((state) => state.auth.username);
//   const token = useSelector((state) => state.auth.token);

//   const [errMsg, setErrMsg] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (pwd !== confirmPwd) {
//       setErrMsg("Passwords do not match");
//       return;
//     }

//     try {
//       const userData = await updateProfile({
//         username,
//         email,
//         address,
//         password: pwd,
//       }).unwrap();
//       setUsername("");
//       setEmail("");
//       setAddress("");
//       setPwd("");
//       setConfirmPwd("");
//       dispatch(setCredentials({ ...userData }));
//       successRef.current.focus();
//       successRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     } catch (err) {
//       setErrMsg(err?.data?.message || err.error);
//       console.log(err?.data?.message || err.error);
//       errRef.current.focus();
//       errRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   useEffect(() => {
//     setUsername(userInfo);
//     // setEmail(userInfo.email);
//     // setAddress(userInfo.address);
//   }, [userInfo]);

//   useEffect(() => {
//     setErrMsg("");
//   }, [username, email, address, pwd, confirmPwd]);

//   const errClass = errMsg ? "errmsg" : "offscreen";

//   return (
//     <>
//       <div id='loginform-container'>
//         <h2> Profile </h2>

//         <form onSubmit={handleSubmit}>
//           <div className='form-group'>
//             <label htmlFor='username'>{/* <MdAlternateEmail /> */}</label>
//             <input
//               id='username'
//               name='username'
//               type='text'
//               ref={userRef}
//               autoComplete='off'
//               onChange={(e) => setUsername(e.target.value)}
//               value={username}
//               placeholder='Username'
//             />
//           </div>
//           <div className='form-group'>
//             <label htmlFor='email'>{/* <MdAlternateEmail /> */}</label>
//             <input
//               id='email'
//               name='email'
//               type='email'
//               autoComplete='off'
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//               placeholder='Email'
//             />
//           </div>

//           <div className='form-group'>
//             <label htmlFor='address'>{/* <MdAlternateAddress /> */}</label>
//             <input
//               id='address'
//               name='address'
//               type='text'
//               autoComplete='off'
//               onChange={(e) => setAddress(e.target.value)}
//               value={address}
//               placeholder='Address'
//             />
//           </div>

//           <div className='form-group'>
//             <label htmlFor='password'>{/* <MdOutlinePassword /> */}</label>
//             <input
//               id='password'
//               name='password'
//               type='password'
//               onChange={(e) => setPwd(e.target.value)}
//               value={pwd}
//               placeholder='Password'
//             />
//           </div>

//           <div className='form-group'>
//             <label htmlFor='password2'>{/* <MdOutlinePassword /> */}</label>
//             <input
//               id='password2'
//               name='password2'
//               type='password'
//               onChange={(e) => setConfirmPwd(e.target.value)}
//               value={confirmPwd}
//               placeholder='Confirm Password'
//             />
//           </div>

//           <button type='submit' disabled={isLoading}>
//             {isLoading ? (
//               <div className='spinner-container'>
//                 <div className='spinner'></div>
//               </div>
//             ) : (
//               <>
//                 Update
//                 {/* <MdLogin /> */}
//               </>
//             )}
//           </button>
//         </form>

//         <p className={errClass} ref={errRef} aria-live='assertive'>
//           {errMsg}
//         </p>
//         {isSuccess && (
//           <p className='success-message' ref={successRef} aria-live='assertive'>
//             updated successfully
//           </p>
//         )}
//       </div>
//     </>
//   );
// }
