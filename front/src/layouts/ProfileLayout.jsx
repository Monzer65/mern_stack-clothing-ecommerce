import { Outlet } from "react-router-dom";
import styles from "./profileLayout.module.css";

// import { Link } from "react-router-dom";
export default function ProfileLayout() {
  return (
    <div className={styles.profileLayout}>
      <h1>User Profile</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
