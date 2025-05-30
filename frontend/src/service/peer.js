
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
//             peersRef.current.push({ peerID: socketId, peer });
//             peerList.push({ peerID: socketId, peer, userId });
//             console.log("👤 Created peer to existing user:", socketId);
//           });
//           setPeers(peerList);
//         });

//         socketRef.current.on("user-joined", ({ socketId, userId }) => {
//           if (peersRef.current.find((p) => p.peerID === socketId)) return;

//           // const peer = addPeer(socketId, stream, null, socketRef.current);
//           // peersRef.current.push({ peerID: socketId, peer });
//           // setPeers((users) => [...users, { peerID: socketId, peer, userId }]);
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
//                 peerID: socketId,
//                 peer,
//               });
//               peerList.push({
//                 userId: remoteUserId,
//                 userName: remoteUserName,
//                 peerID: socketId,
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

  // Stable callback to handle incoming remote streams
  const handleRemoteStream = useCallback((peerID, stream, userName) => {
    setRemoteStreams((prev) => {
      const exists = prev.find((r) => r.peerID === peerID);
      if (exists) {
        // Replace existing stream for peerID
        return prev.map((r) => (r.peerID === peerID ? { peerID, stream, userName } : r));
      }
      // Add new stream
      return [...prev, { peerID, stream, userName }];
    });
  }, []);

  useEffect(() => {
    if (!roomId || !userId) return;

    socketRef.current = io(process.env.REACT_APP_API_URL);

    // Force disconnect handling
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

    // Get user media and join room
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        localVideoStreamRef.current = stream;

        socketRef.current.emit("join-room", { roomId, userId, userName });
        console.log(`🔗 User ${userName} (${userId}) joined room ${roomId}`);

        // Receive all users currently in the room
        socketRef.current.on("all-users", (users) => {
          peersRef.current = []; // Clear current peers to avoid duplicates
          const peerList = [];

          users.forEach(
            ({ socketId, userId: remoteUserId, userName: remoteUserName }) => {
              // Skip if peer already exists
              if (peersRef.current.find((p) => p.userId === remoteUserId))
                return;

              const peer = createPeer(
                socketId,
                socketRef.current.id,
                stream,
                userId,
                userName,
                socketRef.current,
                handleRemoteStream
              );

              peersRef.current.push({
                userId: remoteUserId,
                userName: remoteUserName,
                peerID: socketId,
                peer,
              });

              peerList.push({
                userId: remoteUserId,
                userName: remoteUserName,
                peerID: socketId,
                peer,
              });
            }
          );

          setPeers(peerList);
        });

        // New user joined (signaling handled in user-signal event)
        socketRef.current.on(
          "user-joined",
          ({ socketId, userId: remoteUserId, userName: remoteUserName }) => {
            console.log(
              `👥 User joined: ${remoteUserName} (${remoteUserId}) [${socketId}]`
            );

            // Avoid duplicate peer connections
            const alreadyConnected = peersRef.current.some(
              (p) => p.userId === remoteUserId
            );
            if (alreadyConnected) {
              console.warn(
                `⚠️ Skipping duplicate peer for userId: ${remoteUserId}`
              );
              return;
            }

            // Initiate peer connection
            const peer = createPeer(
              socketId,
              socketRef.current.id,
              localVideoStreamRef.current,
              userId,
              userName,
              socketRef.current,
              handleRemoteStream
            );

            const newPeer = {
              userId: remoteUserId,
              userName: remoteUserName,
              peerID: socketId,
              peer,
            };

            peersRef.current.push(newPeer);
            setPeers((prev) => [...prev, newPeer]);
          }
        );
        

        // Incoming signal from a peer who initiated connection
        socketRef.current.on(
          "user-signal",
          ({ callerId, signal, callerUserId, callerUserName }) => {
            // Remove stale peer if exists
            const existing = peersRef.current.find(
              (p) => p.userId === callerUserId
            );
            if (existing) {
              console.warn("⚠ Removing stale peer for user:", callerUserId);
              existing.peer.destroy();
              peersRef.current = peersRef.current.filter(
                (p) => p.userId !== callerUserId
              );
              setPeers((prev) => prev.filter((p) => p.userId !== callerUserId));
            }

            const peer = addPeer(
              callerId,
              localVideoStreamRef.current,
              signal,
              socketRef.current,
              handleRemoteStream,
              callerUserId,
              callerUserName
            );
            if (!peer) return;

            peersRef.current.push({
              userId: callerUserId,
              userName: callerUserName,
              peerID: callerId,
              peer,
            });
            setPeers((prev) => [
              ...prev,
              {
                userId: callerUserId,
                userName: callerUserName,
                peerID: callerId,
                peer,
              },
            ]);
          }
        );

        // Receiving returned signal after our initiator signal
        socketRef.current.on("receiving-returned-signal", ({ id, signal }) => {
          const item = peersRef.current.find((p) => p.peerID === id);
          if (item) {
            item.peer.signal(signal);
            console.log("📶 Signal returned from:", id);
          }
        });

        // User left room event
        socketRef.current.on(
          "user-left",
          ({ socketId, userId: leftUserId }) => {
            const peerObj = peersRef.current.find(
              (p) => p.userId === leftUserId
            );
            if (peerObj) {
              peerObj.peer.destroy();
            }
            peersRef.current = peersRef.current.filter(
              (p) => p.userId !== leftUserId
            );
            setPeers((prev) => prev.filter((p) => p.userId !== leftUserId));
            console.log("❌ User left:", leftUserId);
          }
        );
      })
      .catch((err) => {
        console.error("Failed to get user media:", err);
        alert("Failed to access camera and microphone.");
        if (navigate) navigate("/");
      });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("confirm-disconnect");
        socketRef.current.off("force-disconnect");
        socketRef.current.off("all-users");
        socketRef.current.off("user-joined");
        socketRef.current.off("user-signal");
        socketRef.current.off("receiving-returned-signal");
        socketRef.current.off("user-left");
      }
      leaveRoom();
    };
  }, [userId, userName, roomId, navigate, handleRemoteStream]);

  // Clean up all peers
  const cleanupAllPeers = () => {
    peersRef.current.forEach(({ peer }) => peer.destroy());
    peersRef.current = [];
    setPeers([]);
    setRemoteStreams([]);
  };

  // Leave room and disconnect
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

// Create a new peer to initiate call
function createPeer(
  userToSignal,
  callerID,
  stream,
  userId,
  userName,
  socket,
  onRemoteStream
) {
  const peer = new Peer({ initiator: true, trickle: false, stream });

  peer.on("signal", (signal) => {
    socket.emit("sending-signal", {
      target: userToSignal,
      callerId: callerID,
      signal,
      userId,
      userName,
    });
  });

  peer.on("stream", (remoteStream) => {
    onRemoteStream(userToSignal, remoteStream, userName);
  });

  return peer;
}

// Add a peer who initiated the call
function addPeer(
  incomingID,
  stream,
  incomingSignal,
  socket,
  onRemoteStream,
  userId,
  userName
) {
  const peer = new Peer({ initiator: false, trickle: false, stream });

  if (incomingSignal) {
    peer.signal(incomingSignal);
  }

  peer.on("signal", (signal) => {
    socket.emit("returning-signal", {
      signal,
      callerId: incomingID,
      userId,
      userName,
    });
  });

  peer.on("stream", (remoteStream) => {
    onRemoteStream(incomingID, remoteStream, userName);
  });

  return peer;
}
