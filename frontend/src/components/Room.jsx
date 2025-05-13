import React, { useState } from "react";
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
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { localVideoRef, remoteStreams, localStream, leaveRoom } =
    useMultiWebRTC(roomId, userId);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

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
      <h1 className="ml-2 text-2xl flex justify-center text-center">
        Room Page
      </h1>
      <h2 className="flex justify-center text-center ml-2 text-lg">
        Room ID: {roomId}
      </h2>

      <div className="flex flex-col w-2/5">
        <h1 className="ml-2 text-lg">My Stream</h1>
        <video
          muted
          ref={localVideoRef}
          autoPlay
          playsInline
          className="video"
        />
      </div>
      <div className="bg-slate-800 h-16 w-2/5">
        <div className="flex gap-6 p-2">
          <button
            onClick={toggleMic}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>

          <button
            onClick={toggleCamera}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
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

      {remoteStreams.map(({ peerID, stream }) => (
        <div key={peerID}>
          <p>Peer ID: {peerID}</p>
          <video
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
            autoPlay
            playsInline
            className="video"
          />
        </div>
      ))}
    </div>
  );
}
