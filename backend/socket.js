// const emailToSocketIdMap = new Map();
// const socketidToEmailMap = new Map();

// export default function socketHandler(io) {
//   io.on("connection", (socket) => {
//     console.log(`Socket Connected: ${socket.id}`);

//     socket.on("room:join", (data) => {
//       const { email, room } = data;
//       if (!email || !room) return;

//       emailToSocketIdMap.set(email, socket.id);
//       socketidToEmailMap.set(socket.id, email);

//       socket.join(room);
//       console.log(`${email} joined room ${room}`);

//       io.to(room).emit("user:joined", { email, id: socket.id });
//       io.to(socket.id).emit("room:join", data);
//     });

//     socket.on("user:call", ({ to, offer }) => {
//       io.to(to).emit("incomming:call", { from: socket.id, offer });
//     });

//     socket.on("call:accepted", ({ to, ans }) => {
//       io.to(to).emit("call:accepted", { from: socket.id, ans });
//     });

//     socket.on("peer:nego:needed", ({ to, offer }) => {
//       console.log("peer:nego:needed", offer);
//       io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
//     });

//     socket.on("peer:nego:done", ({ to, ans }) => {
//       console.log("peer:nego:done", ans);
//       io.to(to).emit("peer:nego:final", { from: socket.id, ans });
//     });

//     socket.on("disconnect", () => {
//       const email = socketidToEmailMap.get(socket.id);
//       console.log(`Client disconnected: ${email} (${socket.id})`);

//       emailToSocketIdMap.delete(email);
//       socketidToEmailMap.delete(socket.id);
      
//       socket.rooms.forEach((room) => {
//         socket.to(room).emit("user:left", { email, id: socket.id });
//       });
//     });
//   });
// }


// const usersInRoom = {};
// const socketToRoom = {};

// export default function socketHandler(io) {
//   io.on("connection", (socket) => {
//     console.log("🔌 User connected:", socket.id);

//     socket.on("join-room", ({ roomId, userId }) => {
//       console.log(`👤 User ${userId} joined room ${roomId}`);
//       socket.join(roomId);
//       socketToRoom[socket.id] = roomId;

//       // Store user in room
//       if (!usersInRoom[roomId]) {
//         usersInRoom[roomId] = [];
//       }
//       usersInRoom[roomId].push({ socketId: socket.id, userId });

//       // Send existing users to the newly joined user
//       const otherUsers = usersInRoom[roomId].filter(
//         (u) => u.socketId !== socket.id
//       );
//       socket.emit("all-users", otherUsers);

//       // Notify others in the room of the new user
//       socket.to(roomId).emit("user-joined", {
//         socketId: socket.id,
//         userId,
//       });

//       // Handle signal sent from joining user to others
//       socket.on("sending-signal", (payload) => {
//         console.log(`📤 Sending signal from ${socket.id} to ${payload.target}`);
//         const callerUserId = usersInRoom[roomId]?.find(
//           (u) => u.socketId === socket.id
//         )?.userId;

//         io.to(payload.target).emit("user-signal", {
//           signal: payload.signal,
//           callerId: socket.id,
//           callerUserId, // ✅ Send correct user ID of the caller
//         });
//       });

//       // Handle signal returned from receiving user
//       socket.on("returning-signal", (payload) => {
//         console.log(
//           `📥 Returning signal from ${socket.id} to ${payload.callerId}`
//         );
//         io.to(payload.callerId).emit("receiving-returned-signal", {
//           signal: payload.signal,
//           id: socket.id,
//         });
//       });

//       // Handle disconnect
//       socket.on("disconnect", () => {
//         const roomId = socketToRoom[socket.id];
//         console.log(`❌ User ${socket.id} disconnected from room ${roomId}`);

//         if (roomId && usersInRoom[roomId]) {
//           usersInRoom[roomId] = usersInRoom[roomId].filter(
//             (u) => u.socketId !== socket.id
//           );
//           socket.to(roomId).emit("user-left", socket.id);

//           if (usersInRoom[roomId].length === 0) {
//             delete usersInRoom[roomId];
//           }
//         }

//         delete socketToRoom[socket.id];
//       });
//     });

//     socket.on("leave-room", ({ roomId, userId }) => {
//       console.log(`🚪 User ${userId} manually left room ${roomId}`);

//       // Remove user from room
//       if (usersInRoom[roomId]) {
//         usersInRoom[roomId] = usersInRoom[roomId].filter(
//           (u) => u.socketId !== socket.id
//         );
//         socket.to(roomId).emit("user-left", socket.id);

//         if (usersInRoom[roomId].length === 0) {
//           delete usersInRoom[roomId];
//         }
//       }

//       delete socketToRoom[socket.id];
//       socket.leave(roomId);
//     });
    
//   });
// }

// const usersInRoom = {};
// const socketToRoom = {};
// const userToSocket = {}; // userId => socketId
// const pendingUserConfirmations = {}; // userId => [{ newSocketId, roomId }]

// export default function socketHandler(io) {
//   io.on("connection", (socket) => {
//     console.log("🔌 User connected:", socket.id);

//     // Handle join-room request
//     socket.on("join-room", ({ roomId, userId }) => {
//       console.log(`👤 User ${userId} attempting to join room ${roomId}`);

//       const existingSocketId = userToSocket[userId];

//       if (existingSocketId && existingSocketId !== socket.id) {
//         console.log(
//           `⚠️ User ${userId} already has session on socket ${existingSocketId}`
//         );

//         // Queue this attempt for later
//         if (!pendingUserConfirmations[userId]) {
//           pendingUserConfirmations[userId] = [];
//         }
//         pendingUserConfirmations[userId].push({
//           newSocketId: socket.id,
//           roomId,
//         });

//         console.log(
//           `📨 Sending confirmation request to existing socket ${existingSocketId}`
//         );
//         io.to(existingSocketId).emit("confirm-disconnect", {
//           newSocketId: socket.id,
//           message:
//             "A new login attempt is requesting access. Do you want to allow it?",
//         });

//         return; // Wait for confirmation before proceeding
//       }

//       // Proceed with joining
//       console.log(
//         `✅ Allowing user ${userId} to join room ${roomId} with socket ${socket.id}`
//       );
//       userToSocket[userId] = socket.id;
//       socket.join(roomId);
//       socketToRoom[socket.id] = roomId;

//       // Add to room users
//       if (!usersInRoom[roomId]) {
//         usersInRoom[roomId] = [];
//       }

//       if (!usersInRoom[roomId].some((u) => u.userId === userId)) {
//         usersInRoom[roomId].push({ socketId:socket.id, userId });
//       }

//       // console.log(`👥 Current users in room ${roomId}:`, usersInRoom[roomId]);
      
//       // usersInRoom[roomId].push({ socketId: socket.id, userId });

//       // Notify the joining user of others
//       const otherUsers = usersInRoom[roomId].filter(
//         (u) => u.socketId !== socket.id
//       );
//       console.log("otherUsers:", otherUsers.length);
//       socket.emit("all-users", otherUsers);

//       // Notify existing users in room
//       socket.to(roomId).emit("user-joined", {
//         socketId: socket.id,
//         userId,
//       });

//       console.log(`📦 User ${userId} added to usersInRoom[${roomId}]`);
//     });

//     socket.on("get-users", () => {
//       const roomId = socketToRoom[socket.id];
//       if (!roomId || !usersInRoom[roomId]) return;

//       const otherUsers = usersInRoom[roomId].filter(
//         (u) => u.socketId !== socket.id
//       );
//       socket.emit("all-users", otherUsers);
//     });

//     socket.on("send-chat-message", ({ from, to, text, timestamp }) => {
//       const roomId = socketToRoom[socket.id];
//       if (!roomId) return;

//       const message = { from, to, text, timestamp };

//       if (to === "all") {
//         // Broadcast to all except sender
//         socket.to(roomId).emit("chat-message", message);
//       } else {
//         // Private message
//         const targetSocketId = userToSocket[to];
//         if (targetSocketId) {
//           io.to(targetSocketId).emit("chat-message", message);
//         }
//       }

//       // Echo back to sender (to show their own message)
//       socket.emit("chat-message", message);
//     });


//     // Handle incoming WebRTC signal
//     socket.on("sending-signal", (payload) => {
//       console.log(`📤 Sending signal from ${socket.id} to ${payload.target}`);
//       const roomId = socketToRoom[socket.id];
//       const callerUserId = usersInRoom[roomId]?.find(
//         (u) => u.socketId === socket.id
//       )?.userId;

//       io.to(payload.target).emit("user-signal", {
//         signal: payload.signal,
//         callerId: socket.id,
//         callerUserId,
//       });
//     });

//     // Handle return signal
//     socket.on("returning-signal", (payload) => {
//       console.log(
//         `📥 Returning signal from ${socket.id} to ${payload.callerId}`
//       );
//       io.to(payload.callerId).emit("receiving-returned-signal", {
//         signal: payload.signal,
//         id: socket.id,
//       });
//     });

//     // Handle disconnect

//     socket.on("disconnect", () => {
//       const roomId = socketToRoom[socket.id];
//       const userId = Object.keys(userToSocket).find(
//         (uid) => userToSocket[uid] === socket.id
//       );

//       console.log(`❌ User ${socket.id} disconnected from room ${roomId}`);

//       if (roomId && usersInRoom[roomId]) {
//         usersInRoom[roomId] = usersInRoom[roomId].filter(
//           (u) => u.socketId !== socket.id
//         );

//         // ✅ Move this below the userId definition
//         socket.to(roomId).emit("user-left", {
//           socketId: socket.id,
//           userId,
//         });

//         if (usersInRoom[roomId].length === 0) {
//           delete usersInRoom[roomId];
//         }
//       }

//       // Clean up userToSocket if this was their session
//       if (userId) {
//         delete userToSocket[userId];
//         console.log(`🧹 Cleaned up userToSocket for userId ${userId}`);
//       }

//       delete socketToRoom[socket.id];
//     });
    

//     // Handle manual leave
//     socket.on("leave-room", ({ roomId, userId }) => {
//       console.log(`🚪 User ${userId} manually left room ${roomId}`);

//       if (usersInRoom[roomId]) {
//         usersInRoom[roomId] = usersInRoom[roomId].filter(
//           (u) => u.socketId !== socket.id
//         );
       
//         socket.to(roomId).emit("user-left", { socketId: socket.id, userId });

//         if (usersInRoom[roomId].length === 0) {
//           delete usersInRoom[roomId];
//         }
//       }

//       delete socketToRoom[socket.id];
//       delete userToSocket[userId];
     
//       socket.leave(roomId);
//     });

//     // Handle confirmation response from existing user
//     socket.on("confirm-disconnect-response", ({ accept, newSocketId }) => {
//       const userId = Object.keys(userToSocket).find(
//         (uid) => userToSocket[uid] === socket.id
//       );
//       if (!userId || !pendingUserConfirmations[userId]) return;

//       const pending = pendingUserConfirmations[userId].find(
//         (p) => p.newSocketId === newSocketId
//       );
//       if (!pending) return;

//       const newSocket = io.sockets.sockets.get(newSocketId);

//       if (accept) {
//         console.log(
//           `✅ User ${userId} accepted new session. Disconnecting current socket ${socket.id}`
//         );
//         io.to(socket.id).emit("force-disconnect", {
//           message: "You accepted the new login. Logging out...",
//         });
//         socket.disconnect(true); // Kick the current one

//         if (newSocket) {
//           console.log(
//             `➡️ Allowing new socket ${newSocketId} to join room ${pending.roomId}`
//           );
//           userToSocket[userId] = newSocketId;
//           newSocket.join(pending.roomId);
//           socketToRoom[newSocketId] = pending.roomId;

//           if (!usersInRoom[pending.roomId]) {
//             usersInRoom[pending.roomId] = [];
//           }

          
//           usersInRoom[pending.roomId].push({ socketId: newSocketId, userId });

//           const others = usersInRoom[pending.roomId].filter(
//             (u) => u.socketId !== newSocketId
//           );
//           newSocket.emit("all-users", others);
//           newSocket.to(pending.roomId).emit("user-joined", {
//             socketId: newSocketId,
//             userId,
//           });
//         }
//       } else {
//         console.log(
//           `⛔ User ${userId} denied new session. Rejecting new socket ${newSocketId}`
//         );
//         if (newSocket) {
//           io.to(newSocketId).emit("force-disconnect", {
//             message: "You are already logged in elsewhere. Session denied.",
//           });
//           newSocket.disconnect(true);
//         }
//       }

//       // Cleanup pending confirmation
//       pendingUserConfirmations[userId] = pendingUserConfirmations[
//         userId
//       ].filter((p) => p.newSocketId !== newSocketId);
//     });
//   });
// }

  
const usersInRoom = {};
const socketToRoom = {};
const userToSocket = {}; // userId => socketId
const userIdToUserName = {}; // userId => userName
const pendingUserConfirmations = {}; // userId => [{ newSocketId, roomId }]
const socketIdToUserId = {}; // ✅ NEW
const socketIdToUserName = {}; // ✅ NEW

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("join-room", ({ roomId, userId, userName }) => {
      console.log(
        `👤 User ${userName} (${userId}) attempting to join room ${roomId}`
      );

      const existingSocketId = userToSocket[userId];

      if (existingSocketId && existingSocketId !== socket.id) {
        console.log(
          `⚠️ User ${userName} (${userId}) already has session on socket ${existingSocketId}`
        );

        if (!pendingUserConfirmations[userId]) {
          pendingUserConfirmations[userId] = [];
        }
        pendingUserConfirmations[userId].push({
          newSocketId: socket.id,
          roomId,
          userName,
        });

        io.to(existingSocketId).emit("confirm-disconnect", {
          newSocketId: socket.id,
          message:
            "A new login attempt is requesting access. Do you want to allow it?",
        });

        return;
      }

      console.log(
        `✅ Allowing user ${userName} (${userId}) to join room ${roomId} with socket ${socket.id}`
      );
      userToSocket[userId] = socket.id;
      userIdToUserName[userId] = userName;
      socketIdToUserId[socket.id] = userId; 
      socketIdToUserName[socket.id] = userName; 

      socket.join(roomId);
      socketToRoom[socket.id] = roomId;

      if (!usersInRoom[roomId]) usersInRoom[roomId] = [];

      if (!usersInRoom[roomId].some((u) => u.userId === userId)) {
        usersInRoom[roomId].push({ socketId: socket.id, userId, userName });
      }

      const otherUsers = usersInRoom[roomId].filter(
        (u) => u.socketId !== socket.id
      );
      socket.emit(
        "all-users",
        otherUsers.map((u) => ({
          socketId: u.socketId,
          userId: u.userId,
          userName: u.userName,
        }))
      );

      socket.to(roomId).emit("user-joined", {
        socketId: socket.id,
        userId,
        userName,
      });

      console.log(
        `📦 User ${userName} (${userId}) added to usersInRoom[${roomId}]`
      );
    });

    socket.on("get-users", () => {
      const roomId = socketToRoom[socket.id];
      if (!roomId || !usersInRoom[roomId]) return;

      const otherUsers = usersInRoom[roomId].filter(
        (u) => u.socketId !== socket.id
      );
      socket.emit(
        "all-users",
        otherUsers.map((u) => ({
          userId: u.userId,
          userName: u.userName,
        }))
      );
    });

    socket.on("send-chat-message", ({ from, to, text, timestamp }) => {
      const roomId = socketToRoom[socket.id];
      if (!roomId) return;

      const message = { from, to, text, timestamp };

      if (to === "all") {
        socket.to(roomId).emit("chat-message", message);
      } else {
        const targetSocketId = userToSocket[to];
        if (targetSocketId) {
          io.to(targetSocketId).emit("chat-message", message);
        }
      }

      socket.emit("chat-message", message);
    });

    socket.on(
      "sending-signal",
      ({ target, callerId, signal, userId, userName }) => {
        console.log(`📤 Sending signal from ${socket.id} to ${target}`);
        const callerUserId = socketIdToUserId[socket.id] || userId;
        const callerUserName = socketIdToUserName[socket.id] || userName;
        userIdToUserName[userId] = userName;

        io.to(target).emit("user-signal", {
          callerId: socket.id,
          signal,
          callerUserId,
          callerUserName,
        });
      }
    );

    socket.on("returning-signal", ({ signal, callerId, userId, userName }) => {
      console.log(`📥 Returning signal from ${socket.id} to ${callerId}`);
      userIdToUserName[userId] = userName;
      const calleeUserId = socketIdToUserId[socket.id] || userId;

      io.to(callerId).emit("receiving-returned-signal", {
        signal,
        id: calleeUserId,
      });
    });

    socket.on("disconnect", () => {
      const roomId = socketToRoom[socket.id];
      const userId = socketIdToUserId[socket.id];
      const userName = socketIdToUserName[socket.id];

      console.log(
        `❌ User ${socket.id} (${
          userName || userId
        }) disconnected from room ${roomId}`
      );

      if (roomId && usersInRoom[roomId]) {
        usersInRoom[roomId] = usersInRoom[roomId].filter(
          (u) => u.socketId !== socket.id
        );

        socket.to(roomId).emit("user-left", {
          userId,
          userName,
        });

        if (usersInRoom[roomId].length === 0) {
          delete usersInRoom[roomId];
        }
      }

      delete userToSocket[userId];
      delete userIdToUserName[userId];
      delete socketToRoom[socket.id];
      delete socketIdToUserId[socket.id]; // ✅ Clean up
      delete socketIdToUserName[socket.id]; // ✅ Clean up

      console.log(`🧹 Cleaned mappings for userId ${userId}`);
    });

    socket.on("leave-room", ({ roomId, userId }) => {
      const userName = userIdToUserName[userId];
      console.log(
        `🚪 User ${userName} (${userId}) manually left room ${roomId}`
      );

      if (usersInRoom[roomId]) {
        usersInRoom[roomId] = usersInRoom[roomId].filter(
          (u) => u.socketId !== socket.id
        );
        socket.to(roomId).emit("user-left", {
          userId,
          userName,
        });

        if (usersInRoom[roomId].length === 0) {
          delete usersInRoom[roomId];
        }
      }

      delete socketToRoom[socket.id];
      delete userToSocket[userId];
      delete userIdToUserName[userId];
      delete socketIdToUserId[socket.id]; 
      delete socketIdToUserName[socket.id]; 
      socket.leave(roomId);
    });

    socket.on("confirm-disconnect-response", ({ accept, newSocketId }) => {
      const userId = socketIdToUserId[socket.id];
      if (!userId || !pendingUserConfirmations[userId]) return;

      const pending = pendingUserConfirmations[userId].find(
        (p) => p.newSocketId === newSocketId
      );
      if (!pending) return;

      const newSocket = io.sockets.sockets.get(newSocketId);

      if (accept) {
        console.log(
          `✅ User ${userId} accepted new session. Disconnecting current socket ${socket.id}`
        );
        io.to(socket.id).emit("force-disconnect", {
          message: "You accepted the new login. Logging out...",
        });
        socket.disconnect(true);

        if (newSocket) {
          console.log(
            `➡️ Allowing new socket ${newSocketId} to join room ${pending.roomId}`
          );
          userToSocket[userId] = newSocketId;
          userIdToUserName[userId] = pending.userName;
          socketIdToUserId[newSocketId] = userId; // ✅ Set
          socketIdToUserName[newSocketId] = pending.userName; // ✅ Set

          newSocket.join(pending.roomId);
          socketToRoom[newSocketId] = pending.roomId;

          if (!usersInRoom[pending.roomId]) {
            usersInRoom[pending.roomId] = [];
          }

          usersInRoom[pending.roomId].push({
            socketId: newSocketId,
            userId,
            userName: pending.userName,
          });

          const others = usersInRoom[pending.roomId].filter(
            (u) => u.socketId !== newSocketId
          );
          newSocket.emit(
            "all-users",
            others.map((u) => ({
              userId: u.userId,
              userName: u.userName,
            }))
          );
          newSocket.to(pending.roomId).emit("user-joined", {
            userId,
            userName: pending.userName,
          });
        }
      } else {
        console.log(
          `⛔ User ${userId} denied new session. Rejecting new socket ${newSocketId}`
        );
        if (newSocket) {
          io.to(newSocketId).emit("force-disconnect", {
            message: "You are already logged in elsewhere. Session denied.",
          });
          newSocket.disconnect(true);
        }
      }

      pendingUserConfirmations[userId] = pendingUserConfirmations[
        userId
      ].filter((p) => p.newSocketId !== newSocketId);
    });
  });
}

