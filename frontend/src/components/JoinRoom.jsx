import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";

export default function JoinMeeting() {
  const navigate = useNavigate()
  const [meetingId, setMeetingId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);

  const videoRef = useRef(null);

  useEffect(() => {
    if (cameraEnabled && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch(() => {
          videoRef.current.poster = "Camera access denied.";
        });
    } else {
      // Stop video stream if camera is turned off
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [cameraEnabled]);

  const handleJoin = () => {
    const payload = {
      meetingId,
      displayName,
      password,
      cameraEnabled,
      microphoneEnabled,
    };
    console.log("Joining with:", payload);
    navigate(`/room/${meetingId}`, { state: payload });
  };

  return (
    <div className="flex justify-center px-4 mt-10 w-full h-max">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Join a Meeting
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Meeting Code
            </label>
            <Input
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="e.g. abc123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password (if any)
            </label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Optional"
            />
          </div>

          <div className="flex items-center gap-4 text-sm mt-2">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={!cameraEnabled}
                onChange={() => setCameraEnabled((prev) => !prev)}
              />
              Turn off Camera
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={!microphoneEnabled}
                onChange={() => setMicrophoneEnabled((prev) => !prev)}
              />
              Turn off Mic
            </label>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Preview Camera View</p>
            {cameraEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-48 rounded-md border object-cover bg-black"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md text-gray-500 text-sm">
                Camera is turned off
              </div>
            )}
          </div>

          <Button
            onClick={handleJoin}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Join Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
