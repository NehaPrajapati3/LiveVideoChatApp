// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSocket } from "../context/SocketProvider";

// const LobbyScreen = () => {
//   const [email, setEmail] = useState("");
//   const [room, setRoom] = useState("");

//   const socket = useSocket();
//   const navigate = useNavigate();

//   const handleSubmitForm = useCallback(
//     (e) => {
//       e.preventDefault();
//       socket.emit("room:join", { email, room });
//     },
//     [email, room, socket]
//   );

//   const handleJoinRoom = useCallback(
//     (data) => {
//       const { email, room } = data;
//       navigate(`/room/${room}`);
//     },
//     [navigate]
//   );

//   useEffect(() => {
//     socket.on("room:join", handleJoinRoom);
//     return () => {
//       socket.off("room:join", handleJoinRoom);
//     };
//   }, [socket, handleJoinRoom]);

//   return (
//     <>
//       <div className="flex flex-col justify-center text-center">
//         <h1>Lobby</h1>
//         <form onSubmit={handleSubmitForm}>
//           <label htmlFor="email">Email ID</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}

//           />
//           <br />
//           <label htmlFor="room">Room Number</label>
//           <input
//             type="text"
//             id="room"
//             value={room}
//             onChange={(e) => setRoom(e.target.value)}
//           />
//           <br />
//           <button>Join</button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default LobbyScreen;

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";

// const Lobby = () => {
//   const [roomId, setRoomId] = useState("");
//   const [displayName, setDisplayName] = useState("");
//   const navigate = useNavigate();

//   const handleJoin = () => {
//     if (!roomId.trim()) {
//       alert("Please enter or generate a room ID");
//       return;
//     }

//     // You can store displayName in Redux or localStorage if needed
//     localStorage.setItem("displayName", displayName);
//     navigate(`/room/${roomId}`);
//   };

//   const createNewRoom = () => {
//     const newRoomId = uuidv4();
//     setRoomId(newRoomId);
//   };

//   return (
//     <div>
//       <div className="lobby-container h-fit flex flex-col justify-center items-center text-center gap-1">
//         <h2 className="text-2xl font-bold mt-2">Video Call Lobby</h2>
//         {/* <input
//           type="text"
//           placeholder="Your name"
//           value={displayName}
//           onChange={(e) => setDisplayName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Room ID"
//           value={roomId}
//           onChange={(e) => setRoomId(e.target.value)}
//         /> */}
//         <div className="flex mt-6 gap-8 flex-wrap justify-center">
//           {" "}
//           <Link to="/createRoom">

//             <button

//               className="btn border-2 text-lg font-semibold rounded-md bg-slate-300 w-40 h-12 flex items-center justify-center text-center hover:bg-slate-500"
//             >
//               Create New Room
//             </button>
//           </Link>
//           <Link to="/joinRoom">
//             <button

//               className="btn border-2 text-lg  font-semibold rounded-md bg-slate-300 w-40 h-12 flex items-center justify-center text-center hover:bg-slate-500"
//             >
//               Join Room
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Lobby;

import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import toast from "react-hot-toast";
import axios from "axios";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  console.log("user in home:", userData);

  const handleLogout = async () => {
    try {
      //console.log("Inside logout");

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/logout`
      );
      // console.log("Inside logout after res");
      // console.log(`Res is ${res}`);

      navigate("/login");
      toast.success(res.data.message);
      dispatch(logout(null));
      console.log("user loged out succesfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          {/* <Avatar>
            <AvatarImage src="/profile.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar> */}
          <div>
            <h2 className="text-lg font-semibold">
              {userData?.userInfo?.fullName}
            </h2>
            <p className="text-sm text-gray-500">{userData?.userAuth?.email}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-4 text-sm">
          {userData && userData.role === "admin" ? (
            <>
              <Link to="/addClass">
                <Button variant="ghost" className="justify-start w-full">
                  Add Class
                </Button>
              </Link>
              <Link to="/createRoom">
                <Button variant="ghost" className="justify-start w-full">
                  Schedule
                </Button>
              </Link>
              <Button variant="ghost" className="justify-start">
                Settings
              </Button>

              <Button
                variant="ghost"
                className="justify-start "
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/joinClass">
                <Button variant="ghost" className="justify-start w-full">
                  Join Class
                </Button>
              </Link>
              <Link to="/myClasses">
                <Button variant="ghost" className="justify-start w-full">
                  My Classes
                </Button>
              </Link>
              <Button variant="ghost" className="justify-start">
                Settings
              </Button>

              <Button
                variant="ghost"
                className="justify-start "
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </nav>
      </div>

      {/* Main Panel */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
