import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import googleIcon from "./assets/google_logo.png";
import appleIcon from "./assets/apple_icon.svg";
import NavBar from "./navBar";
import "./signUp.css";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [visibility, setVisibility] = useState(false);

  const handleUChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleVChange = () => {
    setVisibility(!visibility);
  };

  const validFields =
    username != "" && email.includes("@") && password.length >= 8;

  return (
    <div className="signUpDiv">
      <NavBar />
      <div className="registration">
        <h5>Join marketmoves</h5>
        <p>Embark on your investment journey without a single dollar.</p>
        <br />
        <form>
          <div className="signUpDiv_field">
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="signUpDiv_field">
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEChange}
              placeholder="Email"
              required
            />
            {email != "" && !email.includes("@") && (
              <p>Valid email is required</p>
            )}
          </div>
          <div className="signUpDiv_field">
            <input
              id="password"
              type={visibility ? "text" : "password"}
              value={password}
              onChange={handlePChange}
              placeholder="Password"
              required
            />
            <span className="visibility_toggle" onClick={handleVChange}>
              {visibility ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
            {password != "" && password.length < 8 && (
              <p>Password must be at least 8 characters</p>
            )}
          </div>
          <button type="submit" disabled={!validFields}>
            Continue
          </button>
          <p>Or continue with</p>
          <div className="continueWith">
            <button>
              <div>
                <img src={googleIcon} />
                <p>Continue with Google</p>
              </div>
            </button>
            <button>
              <div>
                <img src={appleIcon} />
                <p>Continue with Apple</p>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
