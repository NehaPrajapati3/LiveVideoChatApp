import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import useVerifyAuth from "../hooks/useVerifyAuth.jsx";
import {RadioGroup} from "./ui/radio-group";


const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: ""
  });
  const [shouldVerify, setShouldVerify] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  //  
  
  const autofillAdmin = () => {
    setUser({
      email: "user2@gmail.com",
      password: "user2",
      role: "admin",
    });
  };

  const autofillStudent = () => {
    setUser({
      email: "user3@gmail.com",
      password: "user3",
      role: "student",
    });
  };


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/user/login`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      navigate("/");
      console.log(res);
      dispatch(login({ userData: res.data.userData }));
      setShouldVerify(true);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setUser({
      email: "",
      password: "",
      role: ""
    });
  };

  useVerifyAuth(shouldVerify);
  console.log("Login useverify")

  return (
    <div>
      <div className="w-96 mx-auto">
        <div className=" w-200 p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
          <h1 className="text-3xl font-bold text-center">Login</h1>
          <form onSubmit={onSubmitHandler} action="">
            <div>
              <label className="label p-2">
                <span className="text-base label-text">Email</span>
              </label>
              <input
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full input input-bordered h-10"
                type="email"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="label p-2">
                <span className="text-base label-text">Password</span>
              </label>
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full input input-bordered h-10"
                type="password"
                placeholder="Password"
              />
            </div>
            <RadioGroup className="flex items-center">
              <label className="label p-2">
                <span className="text-base label-text">Role</span>
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={user.role === "student"}
                  onChange={changeEventHandler}
                  className=" cursor-pointer h-4 w-4"
                />
                <label htmlFor="r1">Student</label>
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={user.role === "admin"}
                  onChange={changeEventHandler}
                  className="cursor-pointer h-4 w-4"
                />
                <label htmlFor="r2">Admin</label>
              </div>
            </RadioGroup>
            <p className="text-center my-2">
              Don't have an account? <Link to="/signup"> signup </Link>
            </p>
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-block btn-sm mt-2 p-1 px-3 hover:bg-blue-500 hover:text-cyan-50 bg-blue-400 transition-all border rounded-md border-slate-700"
              >
                Login
              </button>
            </div>
            {/* <div className="flex justify-center flex-col">
              <p className="text-center my-2">
                Email and password for admin role
              </p>
             
              <div className="flex justify-center">
                <button
                  onClick={handleCopyEmailAsAdmin}
                  
                  className="btn btn-block btn-sm mt-2 p-1 px-3 mx-2 hover:bg-blue-500 hover:text-cyan-50 bg-blue-400 transition-all border rounded-md border-slate-700"
                >
                  Email
                </button>
                <button
                  onClick={handleCopyPasswordAsAdmin}
                  
                  className="btn btn-block btn-sm mt-2 p-1 px-3 mx-2 hover:bg-blue-500 hover:text-cyan-50 bg-blue-400 transition-all border rounded-md border-slate-700"
                >
                  Password
                </button>
              </div>
            </div> */}
            <div className="flex justify-center flex-col mt-4">
              <p className="text-center font-semibold">Auto-Fill Credentials</p>

              <div className="flex justify-center mt-2">
                <button
                  type="button"
                  onClick={autofillAdmin}
                  className="btn btn-sm p-1 px-3 mx-2 hover:bg-green-500 hover:text-white bg-green-400 
                 transition-all border rounded-md border-slate-700"
                >
                  Autofill Admin
                </button>

                <button
                  type="button"
                  onClick={autofillStudent}
                  className="btn btn-sm p-1 px-3 mx-2 hover:bg-purple-500 hover:text-white bg-purple-400 
                 transition-all border rounded-md border-slate-700"
                >
                  Autofill Student
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
