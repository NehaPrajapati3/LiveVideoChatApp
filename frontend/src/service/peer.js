
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

export const useMultiWebRTC = (roomId, userId, navigate) => {
  console.log("iserId in peer.js:", userId);
  const [peers, setPeers] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const socketRef = useRef();
  const peersRef = useRef([]);
  const localVideoRef = useRef();
  const localVideoStreamRef = useRef(null);

  useEffect(() => {
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
      socketRef.current.disconnect();

      peersRef.current.forEach(({ peer }) => peer.destroy());
      peersRef.current = [];
      setPeers([]);
      setRemoteStreams([]);

      if(navigate){
        navigate("/")
      }
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        localVideoStreamRef.current = stream;

        socketRef.current.emit("join-room", { roomId, userId });
        console.log(`User ${userId} joined room ${roomId}`);

        socketRef.current.on("all-users", (users) => {
          const peerList = [];
          users.forEach(({ socketId, userId }) => {
            if (peersRef.current.find((p) => p.peerID === socketId)) return;

            const peer = createPeer(
              socketId,
              socketRef.current.id,
              stream,
              userId,
              socketRef.current,
              handleRemoteStream
            );
            console.log(
              `Created peer for user ${userId} with socket ID ${socketId}`
            );
            peersRef.current.push({ peerID: socketId, peer });
            peerList.push({ peerID: socketId, peer, userId });
            console.log("👤 Created peer to existing user:", socketId);
          });
          setPeers(peerList);
        });

        socketRef.current.on("user-joined", ({ socketId, userId }) => {
          if (peersRef.current.find((p) => p.peerID === socketId)) return;

          // const peer = addPeer(socketId, stream, null, socketRef.current);
          // peersRef.current.push({ peerID: socketId, peer });
          // setPeers((users) => [...users, { peerID: socketId, peer, userId }]);
          console.log(`New user joined: ${userId} with socket ID ${socketId}`);
        });

        // socketRef.current.on("user-signal", ({ callerId, signal, userId }) => {
        //    console.log("Inside on user-signal")
        //   // if (peersRef.current.find((p) => p.peerID === callerId)) return;
          
        //   console.log(`Received signal from ${callerId} for user ${userId}`);
        //   const peer = addPeer(
        //     callerId,
        //     stream,
        //     signal,
        //     socketRef.current,
        //     peersRef
        //   );
        //   if (!peer) return;
        //   peersRef.current.push({ peerID: callerId, peer });
        //   setPeers((users) => [...users, { peerID: callerId, peer, userId }]);
        // });

        socketRef.current.on(
          "user-signal",
          ({ callerId, signal, callerUserId }) => {
            console.log(
              "📡 Received signal from",
              callerId,
              "for user",
              callerUserId
            );

            const peer = addPeer(
              callerId,
              stream,
              signal,
              socketRef.current,
              peersRef,
              handleRemoteStream
            );
            if (!peer) return;

            peersRef.current.push({ peerID: callerId, peer });
            setPeers((users) => [
              ...users,
              { peerID: callerId, peer, userId: callerUserId },
            ]);
          }
        );
        

        socketRef.current.on("receiving-returned-signal", ({ id, signal }) => {
          const item = peersRef.current.find((p) => p.peerID === id);
          if (item) {
            item.peer.signal(signal);
            console.log("📶 Signal returned from:", id);
          }
        });

        socketRef.current.on("user-left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
          setPeers((prev) => prev.filter((p) => p.peerID !== id));
          console.log("❌ User left and peer removed:", id);
        });
      });

    return () => {
      socketRef.current.disconnect();
      peersRef.current.forEach((p) => p.peer.destroy());
    };
  }, [userId, roomId]);

  const handleRemoteStream = (peerID, stream) => {
    console.log("👀 Received remote stream from peer", peerID);
    setRemoteStreams((prev) => [...prev, { peerID, stream }]);
  };

  const leaveRoom = () => {
    socketRef.current.emit("leave-room", { roomId, userId });

    if (localVideoStreamRef.current) {
      localVideoStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    peersRef.current.forEach(({ peer }) => peer.destroy());
    peersRef.current = [];

    setPeers([]);
    setRemoteStreams([]);
    socketRef.current.disconnect();
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
  userToSignal,
  callerID,
  stream,
  userId,
  socket,
  onRemoteStream
) {
  const peer = new Peer({ initiator: true, trickle: false, stream: stream });

  peer.on("signal", (signal) => {
    console.log(`Sending signal from ${callerID} to ${userToSignal}`);
    socket.emit("sending-signal", {
      target: userToSignal,
      callerId: callerID,
      signal,
      userId,
    });
  });

  peer.on("stream", (remoteStream) => {
    onRemoteStream(userToSignal, remoteStream);
  });

  return peer;
}

function addPeer(
  incomingID,
  stream,
  incomingSignal = null,
  socket,
  peersRef,
  onRemoteStream
) {
  if (peersRef.current.find((p) => p.peerID === incomingID)) {
    console.warn("Duplicate peer blocked:", incomingID);
    return null;
  }
  const peer = new Peer({ initiator: false, trickle: false, stream });

  if (incomingSignal) {
    console.log(`Receiving signal from ${incomingID}`);
    peer.signal(incomingSignal);
  }

  peer.on("signal", (signal) => {
    console.log(`Returning signal to ${incomingID}`);
    socket.emit("returning-signal", {
      signal,
      callerId: incomingID,
    });
  });

  peer.on("stream", (remoteStream) => {
    onRemoteStream(incomingID, remoteStream);
  });

  return peer;
}
