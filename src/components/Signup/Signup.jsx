import React, { useState } from "react";
import Classes from "./Signup.module.css";
import { BiHide, BiShow } from "react-icons/bi";
import instance from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const SignUp = ({ visible }) => {
  const { setShow } = visible;
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    // Validate required fields
    if (!username || !firstname || !lastname || !email || !password) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }
    console.log({ username, firstname, lastname, email, password });
    try {
      const response = await instance.post("users/register", {
        username,
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: password,
      });
      console.log("User Registered:", response.data);
      setIsLoading(false);
      setShow(false);
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        setError(
          error.response?.data?.message || "An unexpected error occurred",
        ); // Show server error message
      }
    }
  };
  return (
    <div className={Classes.signup_container}>
      <h2>Join the network</h2>
      <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      <div className={Classes.login_link}>
        Already have an account?{" "}
        <Link onClick={() => setShow(false)}>Sign in</Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            size="65"
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
            // required
            style={{ borderColor: error && !username ? "red" : "" }}
          />
        </div>
        <div className={Classes.inputfirst}>
          <div>
            <input
              size="27"
              type="text"
              placeholder="First name"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={{ borderColor: error && !firstname ? "red" : "" }}
            />
          </div>

          <div>
            <input
              className={Classes.lastName}
              size="26"
              type="text"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={{ borderColor: error && !lastname ? "red" : "" }}
            />
          </div>
        </div>
        <div>
          <input
            size="65"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderColor: error && !email ? "red" : "" }}
          />
        </div>
        <div className={Classes.password_field}>
          <input
            size="65"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderColor: error && !password ? "red" : "" }}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={Classes.toggle_password}
          >
            {showPassword ? (
              <BiShow size={20} color="#E58600" />
            ) : (
              <BiHide size={20} color="#E58600" />
            )}
          </button>
        </div>
        <div className={Classes.paragrap}>
          <p>
            I agree to the
            <Link to="https://www.evangadi.com/legal/privacy">
              {" "}
              privacy policy{" "}
            </Link>
            and{" "}
            <Link to="https://www.evangadi.com/legal/terms/">
              terms of service
            </Link>
            .
          </p>
        </div>
        <button type="submit">
          {isLoading ? <ClipLoader size={12} color="gray" /> : "Agree and Join"}
        </button>
      </form>

      <div className={Classes.login_link}>
        <Link onClick={() => setShow(false)}>Already have an account?</Link>
      </div>
    </div>
  );
};
export default SignUp;
