import { useState } from "react";
import { supabase } from "./supabaseClient";
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

  // Do i need a User variable here?
  // I also have a defined username above (set to "" instead of null)
  // there is one in auth.tsx
  //const [user, setUser] = useState(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignUp();
    
  };

  const handleSignUp = async () => {
    // sign up logic here, will likely involve supabase auth signUpWithPassword method
    // and then also inserting the username into the users table with the returned user id from the sign up method
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    if (error || data === null) {
      console.log("Sign Up error: ", error);
      return;
    } else {
      console.log("Successful sign up:", data);
    }

    if (data.session === null) {
      alert("Check you email, and follow the link through there");
      return;
    }

    const token = data?.session?.access_token;

    if (token === null) {
      // should be !token
      console.log("missing token (sign up)");
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: username, // your username state
      }),
    });

    const json = await res.json();
    setUsername(json);
  };

  return (
    <div className="signUpDiv">
      <NavBar />
      <div className="registration">
        <h5>Join marketmoves</h5>
        <p>Embark on your investment journey without a single dollar.</p>
        <br />
        <form onSubmit={handleSubmit}>
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
