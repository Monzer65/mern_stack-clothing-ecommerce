/** @format */

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// import { Link } from "react-router-dom";
export default function Welcome() {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const welcome = user ? `Welcome ${user}!` : "Welcome!";

  let tokenAbbr;
  if (token) {
    tokenAbbr = `${token.slice(0, 9)}...`;
  }

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
