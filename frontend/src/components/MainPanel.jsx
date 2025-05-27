import React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import useGetScheduledMeetings from 'hooks/useGetScheduledMeetings';
import useGetUserEnrolledMeetings from "hooks/useGetUserEnrolledMeetings";
import { useSelector } from 'react-redux';
import axios from "axios";
import {toast} from "react-hot-toast";
import useGetConflictNotifications from 'hooks/useGetConflictNotification';
import { selectConflictNotifications } from "../redux/selectors";


function MainPanel() {
  const { userData } = useSelector((state) => state.auth);
  console.log("user in MainPanel:", userData);


  useGetScheduledMeetings();
  const meetings = useSelector((state) => state.meeting.meetings || []);
  console.log("meetings:", meetings);

  useGetUserEnrolledMeetings()
  const userMeetings = useSelector((state) => state.meeting.userMeetings || []);
  console.log("userMeetings:", userMeetings);

  useGetConflictNotifications();
  const conflictNotification = useSelector(selectConflictNotifications);
  console.log("conflictNotification:", conflictNotification);


    const [joinCode, setJoinCode] = useState("");

    const sendConflictMessage = async (
      hostId,
      classId,
      startTime
    ) => {
      try {
       // console.log("hostId:", hostId);

        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/conflict/send`,
          {
            toAdminId: hostId,
            classId,
            conflictingMeetingTime: startTime,
            message: "I'm already enrolled in another meeting at this time.",
          },
          { withCredentials: true }
        );
        toast.success("Conflict message sent!");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
          "Failed to send conflict message."
        );
       // console.log("Conflict error:", error);
      }
    };
    

    
  return (
    <div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex gap-4 mb-6">
          <Dialog></Dialog>

          <div className="flex items-center gap-2">
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter Room Code"
              className="w-48"
            />
            <Link to={`/joinRoom?code=${joinCode}`}>
              <Button className="bg-green-600 text-white">Join Room</Button>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Upcoming Meetings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData && userData.role === "admin"
              ? meetings.map((meeting, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-lg">
                        Team Sync #{meeting.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        on {new Date(meeting.startTime).toLocaleDateString()} at{" "}
                        {new Date(meeting.startTime).toLocaleTimeString()}
                      </p>

                      <Link to="/joinRoom">
                        <Button variant="outline" className="mt-2">
                          Join
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              : userMeetings.map((meeting, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-lg">{meeting.title}</h4>

                      <p className="text-sm text-gray-600">
                        on {new Date(meeting.startTime).toLocaleDateString()} at{" "}
                        {new Date(meeting.startTime).toLocaleTimeString()}
                      </p>
                      {meeting.conflicts && meeting.conflicts.length > 0 && (
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() =>
                            sendConflictMessage(
                              meeting.hostId,
                              meeting.classId,
                              meeting.startTime
                            )
                          }
                        >
                          Send Conflict Notice
                        </Button>
                      )}

                      <Link to="/joinRoom">
                        <Button variant="outline" className="mt-2 ml-2">
                          Join
                        </Button>
                      </Link>

                      <div key={meeting._id} className="mt-2">
                        <p>
                          {meeting.title} (
                          {new Date(meeting.startTime).toLocaleDateString()}{" "}
                          {new Date(meeting.startTime).toLocaleTimeString()})
                        </p>

                        {meeting.conflict && (
                          <Button
                          // onClick={() =>
                          //   sendConflictMessage(
                          //     meeting.adminId,
                          //     meeting.classroomId,
                          //     meeting.startTime
                          //   )
                          // }
                          >
                            Send Conflict Notice
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
        <div className="mb-6 mt-6">
          {userData && userData.role === "admin" && (
            <>
              <h3 className="text-xl font-semibold mb-2 text-red-600">
                Conflict Notifications
              </h3>

              {conflictNotification && conflictNotification.length > 0 ? (
                <ul className="space-y-3">
                  {conflictNotification.map((notif, index) => (
                    <li
                      key={notif.id || index}
                      className="border border-red-300 rounded p-3 bg-red-50"
                    >
                      <p className="text-sm font-semibold">
                        Class: {notif.classTitle} — Meeting:{" "}
                        {notif.meetingTitle}
                      </p>
                      <p className="text-sm">
                        From: {notif.from?.userInfo?.fullName || "Unknown"}
                      </p>
                      <p className="text-sm italic">{notif.message}</p>
                      <p className="text-xs text-gray-600">
                        Time:{" "}
                        {notif.meta?.conflictingMeetingTime
                          ? new Date(
                              notif.meta.conflictingMeetingTime
                            ).toLocaleString()
                          : "Unknown"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  No conflict notifications.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPanel
