import { Link } from "react-router-dom";
import { useAuth } from "./authcontext";
import logo from "./assets/logo.png";
import "./navBar.css";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <div className="header">
      <div className="nav-left">
        <img src={logo} alt="logo" />
        <h3>marketmoves</h3>
      </div>
      {/* {user && ( */}
      <ul className="nav">
        <li>
          <Link to="/portfolio">Dashboard</Link>
        </li>
        <li>
          <Link to="/leaderboard">Leaderboard</Link>
        </li>
        <li>
          <Link to="/portfolio">Portfolio</Link>
        </li>
        <li>
          <Link to="/trade-page">Trade</Link>
        </li>
      </ul>
      {/* )} */}

      <ul className="profile">
        {/* AIDEN - here is the sign out code */}
        {/* <li>
          <span onClick={logout} style={{ cursor: "pointer" }}>
            Sign Out
          </span>
        </li> */}
        {user ? (
          <>
            <li>Welcome, {user.email?.split("@")[0]}</li>
            <span onClick={logout} style={{ cursor: "pointer" }}>
              Sign Out
            </span>
          </>
        ) : (
          <>
            <li>
              <Link to="/">Sign in</Link>
            </li>
            <li>
              <Link to="/signup">Register</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default NavBar;

// return (
//     <div className='header'>
//         <img src={logo} />
//         <h3>marketmoves</h3>
//         <ul className='nav'>
//             <li><Link to="/portfolio">Dashboard</Link></li>
//             <li><Link to="/leaderboard">Leaderboard</Link></li>
//             <li><Link to="/portfolio">Portfolio</Link></li>
//         </ul>
//         <ul className='profile'>
//             <li><Link to="/">Sign in</Link></li>
//             <li><Link to="/signup">Register</Link></li>
//         </ul>
//     </div>
// );
// }
