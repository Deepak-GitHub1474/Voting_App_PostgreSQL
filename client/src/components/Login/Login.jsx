import { useUrl } from "../../context/urlContext.jsx";
import { BASE_URL } from "../../config/config.js";

import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const { user } = useUrl();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [responseMsg, setResponseMsgMsg] = useState(null);

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${BASE_URL}/login`, { email, password })
      .then((res) => {
        if (res.data.responseMsg === "Success") {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        toast.error(err.response.data.responseMsg);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2 relative bg-gray-950">
      <img
        src="https://t4.ftcdn.net/jpg/07/23/45/05/240_F_723450545_wVE0F36rBjfeS1GzIrmOgxbWbOodWUDT.jpg"
        alt="bg-img"
        className="h-[100vh] fixed top-0 opacity-15"
      />
      {!user.email ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:w-[500px] w-[95vw] mt-10 py-4 px-2 rounded-lg shadow-[0_0_15px_white] relative"
        >
          <img src="https://cdn-icons-png.freepik.com/512/295/295128.png" alt="logo" className="w-16 absolute left-0 top-[-2rem] animate-pulse"/>
          <h1 className="text-center font-bold text-3xl text-blue-500 mb-2">
            Login Form
          </h1>
          <input
            required
            type="email"
            name="email"
            placeholder="email"
            className="p-3 rounded-md border-none outline-none shadow-[0_0_5px_gray]"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            name="password"
            placeholder="password"
            className="p-3 rounded-md border-none outline-none shadow-[0_0_5px_gray]"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-blue-600 text-white font-bold rounded-md p-[0.7rem] hover:bg-blue-500 cursor-pointer flex items-center justify-center">
            Login
          </button>
          <div className="flex items-center justify-center gap-2 mt-2 text-white">
            <span>Have an account?</span>
            <Link
              to="/register"
              className="font-semibold underline hover:text-blue-400"
            >
              Register
            </Link>
          </div>
        </form>
      ) : (
        <Navigate to="/" />
      )}
    </div>
  );
};

export default Login;
