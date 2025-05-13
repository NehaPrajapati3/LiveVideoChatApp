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


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Lobby = () => {
  const [roomId, setRoomId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!roomId.trim()) {
      alert("Please enter or generate a room ID");
      return;
    }

    // You can store displayName in Redux or localStorage if needed
    localStorage.setItem("displayName", displayName);
    navigate(`/room/${roomId}`);
  };

  const createNewRoom = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
  };

  return (
    <div className="lobby-container flex flex-col justify-center text-center">
      <h2>Video Call Lobby</h2>
      <input
        type="text"
        placeholder="Your name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
       
      />
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        
      />
      <button onClick={createNewRoom} className="btn">
        Create New Room
      </button>
      <button onClick={handleJoin} className="btn mt-2">
        Join Room
      </button>
    </div>
  );
};

export default Lobby;
