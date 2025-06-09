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
  ScreenShareIcon,
  ScreenShareOffIcon,
  MessageSquare,
  MessageSquareDashed,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import ChatRoom from "./ChatRoom";


export default function Room() {
  const location = useLocation();
  const payload = location.state;

  useEffect(() => {
    console.log("Received Payload:", payload);
  }, [payload]);

  
  const { userData } = useSelector((state) => state.auth);
  const userId = userData?._id;
  console.log("userId in room:", userId);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { localVideoRef, remoteStreams, localStream, leaveRoom, peers, socketRef } =
    useMultiWebRTC(roomId, userData, navigate);

  const [focusedVideoId, setFocusedVideoId] = useState("local");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const focusedVideoElement = useRef(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordingChunks, setRecordingChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);



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
      console.log("cameraOn:", cameraOn);
    }
  };

  const handleLeave = () => {
    leaveRoom();
    navigate("/");
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace track in all peers
        remoteStreams.forEach(({ peerID }) => {
          const peerObj = peers.find((p) => p.peerID === peerID);
          if (peerObj) {
            const sender = peerObj.peer._pc
              .getSenders()
              .find((s) => s.track.kind === "video");
            if (sender) {
              sender.replaceTrack(screenTrack);
            }
          }
        });

        // Replace local video display
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error("Screen share failed:", err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];

    // Replace back with webcam video track
    remoteStreams.forEach(({ peerID }) => {
      const peerObj = peers.find((p) => p.peerID === peerID);
      if (peerObj) {
        const sender = peerObj.peer._pc
          .getSenders()
          .find((s) => s.track.kind === "video");
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      }
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    setIsScreenSharing(false);
  };

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const screenVideo = document.createElement("video");
      screenVideo.srcObject = screenStream;
      screenVideo.muted = true;
      await screenVideo.play();

      const webcamVideo = document.createElement("video");
      webcamVideo.srcObject = webcamStream;
      webcamVideo.muted = true;
      await webcamVideo.play();

      setTimeout(() => {
        drawFrame();
      }, 100);

      console.log("Playing screenVideo:", screenVideo.readyState);
      console.log("Playing webcamVideo:", webcamVideo.readyState);


      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext("2d");

      canvasRef.current = canvas;

      isRecordingRef.current = true;
      setIsRecording(true);

      const drawFrame = () => {
        console.log(" Inside Draw frame...");
        console.log("isRecordingRef:", isRecordingRef);
        if (!isRecordingRef.current) return;
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          webcamVideo,
          canvas.width - 220,
          canvas.height - 170,
          200,
          150
        );
        console.log("Drawing frame...");
        requestAnimationFrame(drawFrame);
      };

      drawFrame();

      await new Promise((res) => setTimeout(res, 300));

      const mixedStream = canvas.captureStream(30);
      const audioTracks = webcamStream.getAudioTracks();
      if (audioTracks.length > 0) {
        mixedStream.addTrack(audioTracks[0]);
      }

      if (!MediaRecorder.isTypeSupported("video/webm")) {
        alert("WebM format not supported");
        return;
      }

      const mediaRecorder = new MediaRecorder(mixedStream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        console.log("Data available:", e.data.size); 
        if (e.data.size > 0) chunks.push(e.data);
      };


      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recording.webm";
        a.click();
        URL.revokeObjectURL(url);
        
      };
      

      mediaRecorder.onerror = (e) => {
        console.error("MediaRecorder error:", e.error);
      };

     mediaRecorder.start();
     console.log("MediaRecorder started:", mediaRecorder.state); 

      screenStream.getVideoTracks()[0].addEventListener("ended", () => {
        console.log("Screen share stopped, ending recording.");
        setTimeout(stopRecording, 500); 
      });
    } catch (err) {
      console.error("Recording failed:", err);
      isRecordingRef.current = false;
    }
  };
  
  
  
  const stopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };
  

  
  return (
    <div>
      <div className="h-screen w-screen overflow-auto">
        <div>
          <h1 className="ml-2 text-2xl flex justify-center text-center">
            Room Page
          </h1>
          <h2 className="flex justify-center text-center ml-2 text-lg">
            Room ID: {roomId}
          </h2>
        </div>
        <div className="flex w-full h-full flex-wrap flex-col ">
          <div className="flex flex-wrap  w-full h-full sm:flex-row">
            <div className="w-full sm:w-1/2 h-1/2 sm:h-full">
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
                  <div className="relative group inline-block">
                    <button
                      onClick={toggleMic}
                      disabled={!localStream}
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                      {micOn ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
                      {micOn ? "Off Mic" : "On Mic"}
                    </div>
                  </div>
                  <div className="relative group inline-block">
                    <button
                      onClick={toggleCamera}
                      disabled={!localStream}
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                      {cameraOn ? <Video size={24} /> : <VideoOff size={24} />}
                    </button>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
                      {cameraOn ? "Off Camera" : "On Camera"}
                    </div>
                  </div>

                  <button
                    onClick={handleLeave}
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    <PhoneOff size={24} />
                  </button>

                  <ChatRoom socketRef={socketRef} userId={userId} />

                  <div className="relative group inline-block">
                    <button
                      onClick={toggleScreenShare}
                      disabled={!localStream}
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                      {isScreenSharing ? (
                        <ScreenShareOffIcon size={24} />
                      ) : (
                        <ScreenShareIcon size={24} />
                      )}
                    </button>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
                      {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                    </div>
                  </div>

                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700"
                    >
                      Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                    >
                      Stop Recording
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1  h-full  overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-800 p-6 bg-slate-500">
              <div className="w-full">
                {/* {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-2 bg-yellow-300 h-80 m-2 w-1/2 rounded"
                  >
                    Default Item {i + 1}
                  </div>
                ))} */}
                <div className="flex flex-wrap w-full flex-row">
                  {focusedVideoId !== "local" && localStream && (
                    <div
                      className="p w-1/2 sm:w-1/3 lg:w-1/4 cursor-pointer"
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
                    .map(({ peerID, stream, userName }) => {
                      if (!stream)return null;
                        
                     return (
                          <div
                            key={peerID}
                            className="p-2  w-1/2 sm:w-1/3 lg:w-1/4 cursor-pointer"
                            onClick={() => setFocusedVideoId(peerID)}
                          >
                            {<p>username:{userName}</p>}
                            {stream && <p>Peer ID: {peerID}</p>}
                            <video
                              ref={(video) => assignStream(video, stream)}
                              autoPlay
                              playsInline
                              className="video"
                            />
                          </div>
                        );})}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
