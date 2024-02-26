import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../../config/config";
import toast from "react-hot-toast";

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  // Register
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${BASE_URL}/register`, { name, email, password, phone })
      .then((res) => {
        toast.success(res.data.responseMsg);
        navigate("/login");
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
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 sm:w-[500px] w-[95vw] mt-10 py-4 px-2 rounded-lg shadow-[0_0_5px_gray] relative"
      >
        <img src="https://cdn-icons-png.flaticon.com/512/5721/5721113.png" alt="logo" className="w-16 absolute left-0 top-[-2rem] animate-pulse"/>
        <h1 className="text-center font-bold text-3xl text-blue-500 mb-2">
          Register Form
        </h1>
        <input
          required
          type="text"
          name="name"
          placeholder="name"
          className="p-3 rounded-md border-none outline-none shadow-[0_0_5px_gray]"
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          required
          type="tel"
          name="phone"
          placeholder="phone"
          className="p-3 rounded-md border-none outline-none shadow-[0_0_5px_gray]"
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className="bg-blue-600 text-white font-bold rounded-md p-3 hover:bg-blue-500 cursor-pointer flex items-center justify-center">
          Register
        </button>
        <div className="flex items-center justify-center gap-2 mt-2 text-white">
          <span>Have an account?</span>
          <Link
            to="/login"
            className="font-semibold underline hover:text-blue-400"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
