
// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import Peer from "simple-peer";

// export const useMultiWebRTC = (roomId, userId, navigate) => {
//   console.log("userId in peer.js:", userId);
//   const [peers, setPeers] = useState([]);
//   const [remoteStreams, setRemoteStreams] = useState([]);
//   const socketRef = useRef();
//   const peersRef = useRef([]);
//   const localVideoRef = useRef();
//   const localVideoStreamRef = useRef(null);

//   useEffect(() => {
//     socketRef.current = io(process.env.REACT_APP_API_URL);

//     socketRef.current.on("confirm-disconnect", ({ newSocketId, message }) => {
//       const confirmSwitch = window.confirm(
//         message || "Another login is trying to connect. Allow it?"
//       );
//       socketRef.current.emit("confirm-disconnect-response", {
//         accept: confirmSwitch,
//         newSocketId,
//       });
//     });

//     socketRef.current.on("force-disconnect", ({ message }) => {
//       alert(message || "Disconnected due to another session.");
//       socketRef.current.disconnect();

//       peersRef.current.forEach(({ peer }) => peer.destroy());
//       peersRef.current = [];
//       setPeers([]);
//       setRemoteStreams([]);

//       if(navigate){
//         navigate("/")
//       }
//     });

//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         localVideoRef.current.srcObject = stream;
//         localVideoStreamRef.current = stream;

//         socketRef.current.emit("join-room", { roomId, userId });
//         console.log(`User ${userId} joined room ${roomId}`);

//         socketRef.current.on("all-users", (users) => {
//           const peerList = [];
//           users.forEach(({ socketId, userId }) => {
//             if (peersRef.current.find((p) => p.peerID === socketId)) return;

//             const peer = createPeer(
//               socketId,
//               socketRef.current.id,
//               stream,
//               userId,
//               socketRef.current,
//               handleRemoteStream
//             );
//             console.log(
//               `Created peer for user ${userId} with socket ID ${socketId}`
//             );
//             peersRef.current.push({  peerID: remoteUserId, peer });
//             peerList.push({  peerID: remoteUserId, peer, userId });
//             console.log("👤 Created peer to existing user:", socketId);
//           });
//           setPeers(peerList);
//         });

//         socketRef.current.on("user-joined", ({ socketId, userId }) => {
//           if (peersRef.current.find((p) => p.peerID === socketId)) return;

//           // const peer = addPeer(socketId, stream, null, socketRef.current);
//           // peersRef.current.push({  peerID: remoteUserId, peer });
//           // setPeers((users) => [...users, {  peerID: remoteUserId, peer, userId }]);
//           console.log(`New user joined: ${userId} with socket ID ${socketId}`);
//         });

//         // socketRef.current.on("user-signal", ({ callerId, signal, userId }) => {
//         //    console.log("Inside on user-signal")
//         //   // if (peersRef.current.find((p) => p.peerID === callerId)) return;
          
//         //   console.log(`Received signal from ${callerId} for user ${userId}`);
//         //   const peer = addPeer(
//         //     callerId,
//         //     stream,
//         //     signal,
//         //     socketRef.current,
//         //     peersRef
//         //   );
//         //   if (!peer) return;
//         //   peersRef.current.push({ peerID: callerId, peer });
//         //   setPeers((users) => [...users, { peerID: callerId, peer, userId }]);
//         // });

//         socketRef.current.on(
//           "user-signal",
//           ({ callerId, signal, callerUserId }) => {
//             console.log(
//               "📡 Received signal from",
//               callerId,
//               "for user",
//               callerUserId
//             );

//             const peer = addPeer(
//               callerId,
//               stream,
//               signal,
//               socketRef.current,
//               peersRef,
//               handleRemoteStream
//             );
//             if (!peer) return;

//             peersRef.current.push({ peerID: callerId, peer });
//             setPeers((users) => [
//               ...users,
//               { peerID: callerId, peer, userId: callerUserId },
//             ]);
//           }
//         );
        

//         socketRef.current.on("receiving-returned-signal", ({ id, signal }) => {
//           const item = peersRef.current.find((p) => p.peerID === id);
//           if (item) {
//             item.peer.signal(signal);
//             console.log("📶 Signal returned from:", id);
//           }
//         });

//         socketRef.current.on("user-left", (id) => {
//           const peerObj = peersRef.current.find((p) => p.peerID === id);
//           if (peerObj) {
//             peerObj.peer.destroy();
//           }
//           peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
//           setPeers((prev) => prev.filter((p) => p.peerID !== id));
//           console.log("❌ User left and peer removed:", id);
//         });
//       });

//     return () => {
//       socketRef.current.disconnect();
//       peersRef.current.forEach((p) => p.peer.destroy());
//     };
//   }, [userId, roomId]);

//   const handleRemoteStream = (peerID, stream) => {
//     console.log("👀 Received remote stream from peer", peerID);
//     setRemoteStreams((prev) => [...prev, { peerID, stream }]);
//   };

//   const leaveRoom = () => {
//     socketRef.current.emit("leave-room", { roomId, userId });

//     if (localVideoStreamRef.current) {
//       localVideoStreamRef.current.getTracks().forEach((track) => track.stop());
//     }

//     peersRef.current.forEach(({ peer }) => peer.destroy());
//     peersRef.current = [];

//     setPeers([]);
//     setRemoteStreams([]);
//     socketRef.current.disconnect();
//   };
  

//   return {
//     localVideoRef,
//     peers,
//     remoteStreams,
//     localStream: localVideoStreamRef.current,
//     leaveRoom,
//     socketRef,
//   };
// };

// function createPeer(
//   userToSignal,
//   callerID,
//   stream,
//   userId,
//   socket,
//   onRemoteStream
// ) {
//   const peer = new Peer({ initiator: true, trickle: false, stream: stream });

//   peer.on("signal", (signal) => {
//     console.log(`Sending signal from ${callerID} to ${userToSignal}`);
//     socket.emit("sending-signal", {
//       target: userToSignal,
//       callerId: callerID,
//       signal,
//       userId,
//     });
//   });

//   peer.on("stream", (remoteStream) => {
//     onRemoteStream(userToSignal, remoteStream);
//   });

//   return peer;
// }

// function addPeer(
//   incomingID,
//   stream,
//   incomingSignal = null,
//   socket,
//   peersRef,
//   onRemoteStream
// ) {
//   if (peersRef.current.find((p) => p.peerID === incomingID)) {
//     console.warn("Duplicate peer blocked:", incomingID);
//     return null;
//   }
//   const peer = new Peer({ initiator: false, trickle: false, stream });

//   if (incomingSignal) {
//     console.log(`Receiving signal from ${incomingID}`);
//     peer.signal(incomingSignal);
//   }

//   peer.on("signal", (signal) => {
//     console.log(`Returning signal to ${incomingID}`);
//     socket.emit("returning-signal", {
//       signal,
//       callerId: incomingID,
//     });
//   });

//   peer.on("stream", (remoteStream) => {
//     onRemoteStream(incomingID, remoteStream);
//   });

//   return peer;
// }


// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import Peer from "simple-peer";

// export const useMultiWebRTC = (roomId, userData, navigate) => {

//   const userId = userData?._id;
//   const userName = userData?.userInfo?.username || "Unknown";
//   const [peers, setPeers] = useState([]);
//   const [remoteStreams, setRemoteStreams] = useState([]);

//   const socketRef = useRef();
//   const peersRef = useRef([]);
//   const localVideoRef = useRef();
//   const localVideoStreamRef = useRef(null);

//   useEffect(() => {
//     socketRef.current = io(process.env.REACT_APP_API_URL);

//     // Handle force disconnects
//     socketRef.current.on("confirm-disconnect", ({ newSocketId, message }) => {
//       const confirmSwitch = window.confirm(
//         message || "Another login is trying to connect. Allow it?"
//       );
//       socketRef.current.emit("confirm-disconnect-response", {
//         accept: confirmSwitch,
//         newSocketId,
//       });
//     });

//     socketRef.current.on("force-disconnect", ({ message }) => {
//       alert(message || "Disconnected due to another session.");
//       cleanupAllPeers();
//       socketRef.current.disconnect();
//       if (navigate) navigate("/");
//     });

//     // Get user media
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         localVideoRef.current.srcObject = stream;
//         localVideoStreamRef.current = stream;

//         socketRef.current.emit("join-room", { roomId, userId, userName});
//         console.log(`🔗 User ${userName} ${userId} joined room ${roomId}`);

//         socketRef.current.on("all-users", (users) => {
//           const peerList = [];

//           users.forEach(
//             ({ socketId, userId: remoteUserId, userName: remoteUserName }) => {
//               if (peersRef.current.find((p) => p.userId === remoteUserId))
//                 return;

//               const peer = createPeer(
//                 socketId,
//                 socketRef.current.id,
//                 stream,
//                 userId,
//                 userName,
//                 socketRef.current,
//                 handleRemoteStream
//               );
//               peersRef.current.push({
//                 userId: remoteUserId,
//                 userName: remoteUserName,
//                  peerID: remoteUserId,
//                 peer,
//               });
//               peerList.push({
//                 userId: remoteUserId,
//                 userName: remoteUserName,
//                  peerID: remoteUserId,
//                 peer,
//               });
//             }
//           );

//           setPeers(peerList);
//         });

//         socketRef.current.on(
//           "user-joined",
//           ({ socketId, userId: remoteUserId }) => {
//             console.log(`👥 New user joined: ${remoteUserId} (${socketId})`);
//             // Handled via signaling
//           }
//         );

//         socketRef.current.on(
//           "user-signal",
//           ({ callerId, signal, callerUserId }) => {
//             const existing = peersRef.current.find(
//               (p) => p.userId === callerUserId
//             );
//             if (existing) {
//               console.warn("⚠ Removing stale peer for user:", callerUserId);
//               existing.peer.destroy();
//               peersRef.current = peersRef.current.filter(
//                 (p) => p.userId !== callerUserId
//               );
//               setPeers((prev) => prev.filter((p) => p.userId !== callerUserId));
//             }

//             const peer = addPeer(
//               callerId,
//               stream,
//               signal,
//               socketRef.current,
//               handleRemoteStream
//             );
//             if (!peer) return;

//             peersRef.current.push({
//               userId: callerUserId,
//               peerID: callerId,
//               peer,
//             });
//             setPeers((prev) => [
//               ...prev,
//               { userId: callerUserId, peerID: callerId, peer },
//             ]);
//           }
//         );

//         socketRef.current.on("receiving-returned-signal", ({ id, signal }) => {
//           const item = peersRef.current.find((p) => p.peerID === id);
//           if (item) {
//             item.peer.signal(signal);
//             console.log("📶 Signal returned from:", id);
//           }
//         });

//         socketRef.current.on(
//           "user-left",
//           ({ socketId, userId: leftUserId }) => {
//             const peerObj = peersRef.current.find(
//               (p) => p.userId === leftUserId
//             );
//             if (peerObj) {
//               peerObj.peer.destroy();
//             }
//             peersRef.current = peersRef.current.filter(
//               (p) => p.userId !== leftUserId
//             );
//             setPeers((prev) => prev.filter((p) => p.userId !== leftUserId));
//             console.log("❌ User left:", leftUserId);
//           }
//         );
//       });

//     return () => {
//       leaveRoom();
//     };
//   }, [userId, roomId]);

//   const handleRemoteStream = (peerID, stream) => {
//     console.log("👀 Received remote stream from peer", peerID);
//     setRemoteStreams((prev) => [...prev, { peerID, stream }]);
//   };

//   const cleanupAllPeers = () => {
//     peersRef.current.forEach(({ peer }) => peer.destroy());
//     peersRef.current = [];
//     setPeers([]);
//     setRemoteStreams([]);
//   };

//   const leaveRoom = () => {
//     socketRef.current.emit("leave-room", { roomId, userId });
//     if (localVideoStreamRef.current) {
//       localVideoStreamRef.current.getTracks().forEach((track) => track.stop());
//     }
//     cleanupAllPeers();
//     socketRef.current.disconnect();
//   };

//   return {
//     localVideoRef,
//     peers,
//     remoteStreams,
//     localStream: localVideoStreamRef.current,
//     leaveRoom,
//     socketRef,
//   };
// };

// function createPeer(
//   userToSignal,
//   callerID,
//   stream,
//   userId,
//   socket,
//   onRemoteStream
// ) {
//   const peer = new Peer({ initiator: true, trickle: false, stream });

//   peer.on("signal", (signal) => {
//     socket.emit("sending-signal", {
//       target: userToSignal,
//       callerId: callerID,
//       signal,
//       userId,
//     });
//   });

//   peer.on("stream", (remoteStream) => {
//     onRemoteStream(userToSignal, remoteStream);
//   });

//   return peer;
// }

// function addPeer(incomingID, stream, incomingSignal, socket, onRemoteStream) {
//   const peer = new Peer({ initiator: false, trickle: false, stream });

//   if (incomingSignal) {
//     peer.signal(incomingSignal);
//   }

//   peer.on("signal", (signal) => {
//     socket.emit("returning-signal", {
//       signal,
//       callerId: incomingID,
//     });
//   });

//   peer.on("stream", (remoteStream) => {
//     onRemoteStream(incomingID, remoteStream);
//   });

//   return peer;
// }


import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

export const useMultiWebRTC = (roomId, userData, navigate) => {
  const userId = userData?._id;
  const userName = userData?.userInfo?.username || "Unknown";

  const [peers, setPeers] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState([]);

  const socketRef = useRef(null);
  const peersRef = useRef([]);
  const localVideoRef = useRef(null);
  const localVideoStreamRef = useRef(null);

  // Map socketId -> userId and userName for signaling
  const socketIdToUserId = useRef({});
  const socketIdToUserName = useRef({});

  const handleRemoteStream = useCallback((peerID, stream, userName) => {
    setRemoteStreams((prev) => {
      const existing = prev.find((r) => r.peerID === peerID);
      if (existing) {
        return prev.map((r) =>
          r.peerID === peerID ? { peerID, stream, userName } : r
        );
      }
      return [...prev, { peerID, stream, userName }];
    });
  }, []);

  useEffect(() => {
    if (!roomId || !userId) return;

    socketRef.current = io(process.env.REACT_APP_API_URL);

    socketRef.current.on("confirm-disconnect", ({ newSocketId, message }) => {
      const confirmSwitch = window.confirm(
        message || "Another login is trying to connect. Allow it?"
      );
      socketRef.current.emit("confirm-disconnect-response", {
        accept: confirmSwitch,
        newSocketId,
      });
    });

    socketRef.current.on("force-disconnect", ({ message }) => {
      alert(message || "Disconnected due to another session.");
      cleanupAllPeers();
      socketRef.current.disconnect();
      if (navigate) navigate("/");
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        localVideoStreamRef.current = stream;

        socketRef.current.emit("join-room", { roomId, userId, userName });
        console.log(`🔗 User ${userName} (${userId}) joined room ${roomId}`);

        // All existing users in the room, each with socketId, userId, userName
        socketRef.current.on("all-users", (users) => {
          peersRef.current = [];
          socketIdToUserId.current = {};
          socketIdToUserName.current = {};

          const peerList = [];

          users.forEach(
            ({ socketId, userId: remoteUserId, userName: remoteUserName }) => {
              // Map socketId to userId and userName
              socketIdToUserId.current[socketId] = remoteUserId;
              socketIdToUserName.current[socketId] = remoteUserName;

              if (peersRef.current.find((p) => p.peerID === remoteUserId))
                return;

              const peer = createPeer(
                socketId, // target socketId to signal
                socketRef.current.id, // your socketId as callerId
                stream,
                userId,
                userName,
                socketRef.current,
                handleRemoteStream,
                remoteUserId,
                remoteUserName
              );

              const peerObj = {
                userId: remoteUserId,
                userName: remoteUserName,
                peerID: remoteUserId, // Use userId as peerID
                peer,
              };

              peersRef.current.push(peerObj);
              peerList.push(peerObj);
            }
          );

          setPeers(peerList);
        });

        // When a new user joins
        socketRef.current.on(
          "user-joined",
          ({ socketId, userId: remoteUserId, userName: remoteUserName }) => {
            socketIdToUserId.current[socketId] = remoteUserId;
            socketIdToUserName.current[socketId] = remoteUserName;

            if (peersRef.current.some((p) => p.peerID === remoteUserId)) {
              console.warn(`⚠️ Duplicate peer skipped for ${remoteUserId}`);
              return;
            }

            const callerSocketId =
              socketRef.current?.id || socketRef.current?.socket?.id;

            if (!callerSocketId) {
              console.error("❌ Cannot create peer: socket.id is undefined");
              return;
            }

            const peer = createPeer(
              socketId,
              socketRef.current?.id,
              localVideoStreamRef.current,
              userId,
              userName,
              socketRef.current,
              handleRemoteStream,
              remoteUserId,
              remoteUserName
            );

            const newPeer = {
              userId: remoteUserId,
              userName: remoteUserName,
              peerID: remoteUserId,
              peer,
            };

            peersRef.current.push(newPeer);
            setPeers((prev) => [...prev, newPeer]);
          }
        );

        // When receiving a signal from someone else
        socketRef.current.on(
          "user-signal",
          ({ callerId, signal, callerUserId, callerUserName }) => {
            const remoteUserId =
              socketIdToUserId.current[callerId] || callerUserId;
            const remoteUserName =
              socketIdToUserName.current[callerId] || callerUserName;

            let existingPeerObj = peersRef.current.find(
              (p) => p.peerID === remoteUserId
            );
         console.log("existingPeerObj:", existingPeerObj);
            if (existingPeerObj) {
              // If peer already exists, just apply the signal to the existing peer connection
              console.log(
                `📶 Applying signal to existing peer: ${remoteUserId}`
              );
              existingPeerObj.peer.signal(signal);
            } else {
              // If it's a new peer, create and add it
              const peer = addPeer(
                callerId,
                localVideoStreamRef.current,
                signal,
                socketRef.current,
                handleRemoteStream,
                remoteUserId,
                remoteUserName
              );

              const newPeer = {
                userId: remoteUserId,
                userName: remoteUserName,
                peerID: remoteUserId,
                peer,
              };

              peersRef.current.push(newPeer);
              setPeers((prev) => [...prev, newPeer]);
              console.log(`🆕 New peer added for user: ${remoteUserId}`);
            }
          }
        );

        // When receiving returned signal from someone else
        socketRef.current.on("receiving-returned-signal", ({ id, signal }) => {
          console.log("🛰 receiving-returned-signal for userId:", id);
          console.log(
            "📚 peersRef contains:",
            peersRef.current.map((p) => p.peerID)
          );

          const item = peersRef.current.find((p) => p.peerID === id);
          console.log("item:", item);
          if (item) {
            item.peer.signal(signal);
            console.log("📶 Signal returned from:", id);
          }
        });

        socketRef.current.on("user-left", ({ userId: leftUserId }) => {
          const peerObj = peersRef.current.find((p) => p.peerID === leftUserId);
          if (peerObj) peerObj.peer.destroy();

          peersRef.current = peersRef.current.filter(
            (p) => p.peerID !== leftUserId
          );
          setPeers((prev) => prev.filter((p) => p.peerID !== leftUserId));
          setRemoteStreams((prev) =>
            prev.filter((s) => s.peerID !== leftUserId)
          );
          console.log("❌ User left:", leftUserId);
        });
      })
      .catch((err) => {
        console.error("Failed to get user media:", err);
        alert("Failed to access camera and microphone.");
        if (navigate) navigate("/");
      });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      leaveRoom();
    };
  }, [userId, userName, roomId, navigate, handleRemoteStream]);

  const cleanupAllPeers = () => {
    peersRef.current.forEach(({ peer }) => peer.destroy());
    peersRef.current = [];
    setPeers([]);
    setRemoteStreams([]);
  };

  const leaveRoom = () => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("leave-room", { roomId, userId });
      socketRef.current.disconnect();
    }
    if (localVideoStreamRef.current) {
      localVideoStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    cleanupAllPeers();
  };

  return {
    localVideoRef,
    peers,
    remoteStreams,
    localStream: localVideoStreamRef.current,
    leaveRoom,
    socketRef,
  };
};

function createPeer(
  userToSignal, // socketId of remote user
  callerID, // your socketId
  stream,
  localUserId,
  localUserName,
  socket,
  onRemoteStream,
  remoteUserId,
  remoteUserName
) {
  const peer = new Peer({ initiator: true, trickle: false, stream });

  peer.on("signal", (signal) => {
    socket.emit("sending-signal", {
      target: userToSignal, // socketId to send to
      callerId: callerID, // your socketId
      signal,
      userId: localUserId,
      userName: localUserName,
    });
  });

  peer.on("stream", (remoteStream) => {
    onRemoteStream(remoteUserId, remoteStream, remoteUserName);
  });

  return peer;
}

function addPeer(
  incomingID, // socketId of caller
  stream,
  incomingSignal,
  socket,
  onRemoteStream,
  userId,
  userName
) {
  const peer = new Peer({ initiator: false, trickle: false, stream });

  peer.signal(incomingSignal);

  peer.on("signal", (signal) => {
    socket.emit("returning-signal", {
      signal,
      callerId: incomingID, // socketId of caller
      userId,
      userName,
    });
  });

  peer.on("stream", (remoteStream) => {
    onRemoteStream(userId, remoteStream, userName);
  });

  return peer;
}
