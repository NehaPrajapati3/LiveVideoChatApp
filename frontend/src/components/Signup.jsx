import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {RadioGroup} from "./ui/radio-group";


const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
   
  });
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
 
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("user signup:", user)
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/user/signup`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setUser({
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
     
    });
  };
  return (
    <div>
      <div className="w-96 mx-auto">
        <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
          <h1 className="text-3xl font-bold text-center">Signup</h1>
          <form onSubmit={onSubmitHandler} action="">
            <div>
              <label className="label p-2">
                <span className="text-base label-text">Full Name</span>
              </label>
              <input
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className="w-full input input-bordered h-10"
                type="text"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="label p-2">
                <span className="text-base label-text">Username</span>
              </label>
              <input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="w-full input input-bordered h-10"
                type="text"
                placeholder="Username"
              />
            </div>
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
            <div>
              <label className="label p-2">
                <span className="text-base label-text">Confirm Password</span>
              </label>
              <input
                value={user.confirmPassword}
                onChange={(e) =>
                  setUser({ ...user, confirmPassword: e.target.value })
                }
                className="w-full input input-bordered h-10"
                type="password"
                placeholder="Confirm Password"
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
              Already have an account? <Link to="/login"> login </Link>
            </p>
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-block btn-sm mt-2 p-1 px-3 hover:bg-blue-500 hover:text-cyan-50 bg-blue-400 transition-all border rounded-md border-slate-700"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
