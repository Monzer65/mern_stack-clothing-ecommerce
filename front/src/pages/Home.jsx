/** @format */

import { Link } from "react-router-dom";
import Header from "../componentss/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <Link to="/login">Login</Link>
    </div>
  );
}
