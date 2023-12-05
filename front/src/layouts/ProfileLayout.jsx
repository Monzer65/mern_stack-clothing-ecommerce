/** @format */

import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

import { selectToken, selectUser } from "../reducers/authSlice";

// import { Link } from "react-router-dom";
export default function ProfileLayout() {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  const welcome = user ? `Welcome ${user}!` : "Welcome!";
  const tokenAbbr = `${token.slice(0, 9)}...`;

  const content = (
    <section className="welcome">
      <h1>{welcome}</h1>
      <p>Token: {tokenAbbr}</p>
      <p>
        <Link to="/products">Go to the Products List</Link>
      </p>
    </section>
  );

  return content;
  // return (
  //   <>
  //     {token || user ? (
  //       <h1>nothing to show</h1>
  //     ) : (
  //       <>
  //         <header>
  //           <h1>Profile header</h1>
  //         </header>
  //         <div>
  //           <Outlet />
  //         </div>
  //         <footer>
  //           <p>Profile footer</p>
  //         </footer>
  //       </>
  //     )}
  //   </>
  // );
}
