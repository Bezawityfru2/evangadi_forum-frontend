import { Link, useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import classes from "./Login.module.css";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../DataContext/DataContext";
import { BiHide, BiShow } from "react-icons/bi";
import { ClipLoader } from "react-spinners";
import axios from "axios";

function Login({ visible }) {
  const { setShow } = visible || {};
  const emailDom = useRef();
  const passwordDom = useRef();

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    const emailValue = emailDom.current.value;
    const passwordValue = passwordDom.current.value;

    if (!emailValue || !passwordValue) {
      setErrorMessage("Please provide all required information.");
      setIsLoading(false);
      return;
    }

    try {
      // ====  FIX 1: use POST not GET
      const response = await instance.post("/users/login", {
        email: emailValue,
        password: passwordValue,
      });
      console.log("Login response:", response.data);

      const token = response.data.token;
      console.log("Token:", token);
      // ====  save token
      localStorage.setItem("token", token);

      // ==== check user
      const checkUser = await instance.get("/users/checkUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      console.log("TOKEN:", token);

      setUser(checkUser.data);
      navigate("/");

      //  close modal if exists
      if (setShow) setShow(false);
    } catch (error) {
      console.log("FULL ERROR:", error);

      if (error.response) {
        console.log("Status:", error.response.data);
        setErrorMessage(error.response.data.message || "Something went wrong.");
      } else if (error.request) {
        console.log("NO RESPONSE:", error.request);
        setErrorMessage("Server not responding.");
      } else {
        console.log("ERROR:", error.message);
        setErrorMessage(error.message || "NETWORK error.");
      }
    }
    setIsLoading(false);
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <section className={classes.signIn_container}>
      <h1>Login to your account</h1>

      <p>
        Don't have an account?{" "}
        <Link onClick={() => setShow && setShow(true)}>
          Create a new account
        </Link>
      </p>

      {errorMessage && <p className={classes.error_message}>{errorMessage}</p>}

      <form onSubmit={handleSubmit} className={classes.signIn_form}>
        <div className={classes.label_in}>
          <input ref={emailDom} type="email" placeholder="Email" required />

          <div className={classes.password_field}>
            <input
              ref={passwordDom}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              required
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={classes.toggle_password}
            >
              {showPassword ? (
                <BiShow size={20} color="#E58600" />
              ) : (
                <BiHide size={20} color="#E58600" />
              )}
            </button>
          </div>
        </div>

        <p className={classes.forgotPwd}>
          <Link className={classes.lnk_toggler}>Forgot password?</Link>
        </p>

        <button className={classes.submit} type="submit">
          {isLoading ? <ClipLoader size={12} color="gray" /> : "Login"}
        </button>
      </form>
    </section>
  );
}

export default Login;
