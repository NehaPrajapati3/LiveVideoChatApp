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


const usersInRoom = {};
const socketToRoom = {};

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("join-room", ({ roomId, userId }) => {
      console.log(`👤 User ${userId} joined room ${roomId}`);
      socket.join(roomId);
      socketToRoom[socket.id] = roomId;

      // Store user in room
      if (!usersInRoom[roomId]) {
        usersInRoom[roomId] = [];
      }
      usersInRoom[roomId].push({ socketId: socket.id, userId });

      // Send existing users to the newly joined user
      const otherUsers = usersInRoom[roomId].filter(
        (u) => u.socketId !== socket.id
      );
      socket.emit("all-users", otherUsers);

      // Notify others in the room of the new user
      socket.to(roomId).emit("user-joined", {
        socketId: socket.id,
        userId,
      });

      // Handle signal sent from joining user to others
      socket.on("sending-signal", (payload) => {
        console.log(`📤 Sending signal from ${socket.id} to ${payload.target}`);
        const callerUserId = usersInRoom[roomId]?.find(
          (u) => u.socketId === socket.id
        )?.userId;

        io.to(payload.target).emit("user-signal", {
          signal: payload.signal,
          callerId: socket.id,
          callerUserId, // ✅ Send correct user ID of the caller
        });
      });

      // Handle signal returned from receiving user
      socket.on("returning-signal", (payload) => {
        console.log(
          `📥 Returning signal from ${socket.id} to ${payload.callerId}`
        );
        io.to(payload.callerId).emit("receiving-returned-signal", {
          signal: payload.signal,
          id: socket.id,
        });
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        const roomId = socketToRoom[socket.id];
        console.log(`❌ User ${socket.id} disconnected from room ${roomId}`);

        if (roomId && usersInRoom[roomId]) {
          usersInRoom[roomId] = usersInRoom[roomId].filter(
            (u) => u.socketId !== socket.id
          );
          socket.to(roomId).emit("user-left", socket.id);

          if (usersInRoom[roomId].length === 0) {
            delete usersInRoom[roomId];
          }
        }

        delete socketToRoom[socket.id];
      });
    });

    socket.on("leave-room", ({ roomId, userId }) => {
      console.log(`🚪 User ${userId} manually left room ${roomId}`);

      // Remove user from room
      if (usersInRoom[roomId]) {
        usersInRoom[roomId] = usersInRoom[roomId].filter(
          (u) => u.socketId !== socket.id
        );
        socket.to(roomId).emit("user-left", socket.id);

        if (usersInRoom[roomId].length === 0) {
          delete usersInRoom[roomId];
        }
      }

      delete socketToRoom[socket.id];
      socket.leave(roomId);
    });
    
  });
}
