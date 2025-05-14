// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useMultiWebRTC } from "../service/peer";
// import { useSelector } from "react-redux";
// import {
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   PhoneOff,
//   MessageSquare,
//   MessageSquareDashed,
// } from "lucide-react";

// export default function Room() {
//   const { userData } = useSelector((state) => state.auth);
//   const userId = userData?._id;
//   console.log("userId in room:", userId);
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const { localVideoRef, remoteStreams, localStream, leaveRoom } =
//     useMultiWebRTC(roomId, userId);

//     const [focusedVideoId, setFocusedVideoId] = useState("local");
//     const getFocusedStream = () => {
//       if (focusedVideoId === "local") {
//         return { id: "local", stream: localStream };
//       }
//       return remoteStreams.find(({ peerID }) => peerID === focusedVideoId);
//     };
    

//   const [micOn, setMicOn] = useState(true);
//   const [cameraOn, setCameraOn] = useState(true);
//   const [chatOpen, setChatOpen] = useState(false);

//   const toggleMic = () => {
//     if (localStream) {
//       localStream.getAudioTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//       setMicOn((prev) => !prev);
//     }
//   };

//   const toggleCamera = () => {
//     if (localStream) {
//       localStream.getVideoTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//       setCameraOn((prev) => !prev);
//     }
//   };

//   const handleLeave = () => {
//     leaveRoom();
//     navigate("/");
//   };

//   return (
//     <div>
//       <div>
//         <h1 className="ml-2 text-2xl flex justify-center text-center">
//           Room Page
//         </h1>
//         <h2 className="flex justify-center text-center ml-2 text-lg">
//           Room ID: {roomId}
//         </h2>
//       </div>
//       <div className="flex flex-wrap">
//         <div className="w-1/2 ">
//           <div className={`flex flex-col w-full cursor-pointer`}>
//             <h1 className="ml-2 text-lg">Focused Stream</h1>
//             <video
//               ref={(video) => {
//                 const focused = getFocusedStream();
//                 if (video && focused?.stream) {
//                   video.srcObject = focused.stream;
//                 }
//                 // Sync localVideoRef for focused local stream
//                 if (
//                   focusedVideoId === "local" &&
//                   localVideoRef.current !== video
//                 ) {
//                   localVideoRef.current = video;
//                 }
//               }}
//               muted={focusedVideoId === "local"}
//               autoPlay
//               playsInline
//               className="video"
//             />
//           </div>

//           <div className="bg-slate-800 h-16 w-full">
//             <div className="flex p-2 justify-between">
//               <button
//                 onClick={toggleMic}
//                 className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
//               >
//                 {micOn ? <Mic size={24} /> : <MicOff size={24} />}
//               </button>

//               <button
//                 onClick={toggleCamera}
//                 className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
//               >
//                 {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
//               </button>

//               <button
//                 onClick={handleLeave}
//                 className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
//               >
//                 <PhoneOff size={24} />
//               </button>

//               <button
//                 onClick={() => setChatOpen((prev) => !prev)}
//                 className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
//               >
//                 {chatOpen ? (
//                   <MessageSquareDashed size={24} />
//                 ) : (
//                   <MessageSquare size={24} />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="w-1/2">
//           <div className="flex flex-wrap w-full flex-row">
//             {/* Show local stream here if not focused */}
//             {focusedVideoId !== "local" && localStream && (
//               <div
//                 className="p-2 w-1/2 cursor-pointer"
//                 onClick={() => setFocusedVideoId("local")}
//               >
//                 <p>You</p>
//                 <video
//                   ref={(video) => {
//                     if (video) video.srcObject = localStream;
//                   }}
//                   muted
//                   autoPlay
//                   playsInline
//                   className="video"
//                 />
//               </div>
//             )}

//             {/* Show all other remote streams except the one currently focused */}
//             {remoteStreams
//               .filter(({ peerID }) => peerID !== focusedVideoId)
//               .map(({ peerID, stream }) => (
//                 <div
//                   key={peerID}
//                   className="p-2 w-1/2 cursor-pointer"
//                   onClick={() => setFocusedVideoId(peerID)}
//                 >
//                   <p>Peer ID: {peerID}</p>
//                   <video
//                     ref={(video) => {
//                       if (video) video.srcObject = stream;
//                     }}
//                     autoPlay
//                     playsInline
//                     className="video"
//                   />
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMultiWebRTC } from "../service/peer";
import { useSelector } from "react-redux";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  MessageSquareDashed,
} from "lucide-react";

export default function Room() {
  const { userData } = useSelector((state) => state.auth);
  const userId = userData?._id;
  console.log("userId in room:", userId);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { localVideoRef, remoteStreams, localStream, leaveRoom } =
    useMultiWebRTC(roomId, userId);

  const [focusedVideoId, setFocusedVideoId] = useState("local");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const focusedVideoElement = useRef(null);

  // Get currently focused stream
  const getFocusedStream = () => {
    if (focusedVideoId === "local") {
      return { id: "local", stream: localStream };
    }
    return remoteStreams.find(({ peerID }) => peerID === focusedVideoId);
  };

  // Assign stream to video element
  const assignStream = (video, stream) => {
    if (video && stream) {
      video.srcObject = stream;
    }
  };

  // Update focused video stream on change
  useEffect(() => {
    const focused = getFocusedStream();
    if (focusedVideoElement.current && focused?.stream) {
      focusedVideoElement.current.srcObject = focused.stream;
    }
    // Sync local ref if focused is local
    if (focusedVideoId === "local") {
      localVideoRef.current = focusedVideoElement.current;
    }
  }, [focusedVideoId, remoteStreams, localStream]);

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMicOn((prev) => !prev);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setCameraOn((prev) => !prev);
    }
  };

  const handleLeave = () => {
    leaveRoom();
    navigate("/");
  };

  return (
    <div>
      <div>
        <h1 className="ml-2 text-2xl flex justify-center text-center">
          Room Page
        </h1>
        <h2 className="flex justify-center text-center ml-2 text-lg">
          Room ID: {roomId}
        </h2>
      </div>

      <div className="flex flex-wrap">
        <div className="w-1/2">
          <div className="flex flex-col w-full cursor-pointer">
            <h1 className="ml-2 text-lg">Focused Stream</h1>
            <video
              ref={focusedVideoElement}
              muted={focusedVideoId === "local"}
              autoPlay
              playsInline
              className="video"
            />
          </div>

          <div className="bg-slate-800 h-16 w-full">
            <div className="flex p-2 justify-between">
              <button
                onClick={toggleMic}
                disabled={!localStream}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                {micOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>

              <button
                onClick={toggleCamera}
                disabled={!localStream}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>

              <button
                onClick={handleLeave}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
              >
                <PhoneOff size={24} />
              </button>

              <button
                onClick={() => setChatOpen((prev) => !prev)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                {chatOpen ? (
                  <MessageSquareDashed size={24} />
                ) : (
                  <MessageSquare size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <div className="flex flex-wrap w-full flex-row">
            {focusedVideoId !== "local" && localStream && (
              <div
                className="p-2 w-1/2 cursor-pointer"
                onClick={() => setFocusedVideoId("local")}
              >
                <p>You</p>
                <video
                  ref={(video) => assignStream(video, localStream)}
                  muted
                  autoPlay
                  playsInline
                  className="video"
                />
              </div>
            )}

            {remoteStreams.length === 0 && (
              <p className="w-full text-center text-gray-400 mt-4">
                Waiting for participants...
              </p>
            )}

            {remoteStreams
              .filter(({ peerID }) => peerID !== focusedVideoId)
              .map(({ peerID, stream }) => (
                <div
                  key={peerID}
                  className="p-2 w-1/2 cursor-pointer"
                  onClick={() => setFocusedVideoId(peerID)}
                >
                  <p>Peer ID: {peerID}</p>
                  <video
                    ref={(video) => assignStream(video, stream)}
                    autoPlay
                    playsInline
                    className="video"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
