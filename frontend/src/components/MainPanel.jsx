import React from 'react';
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import useGetScheduledMeetings from 'hooks/useGetScheduledMeetings';
import { useSelector } from 'react-redux';

function MainPanel() {

  useGetScheduledMeetings();
  const meetings = useSelector((state) => state.meeting.meetings);
  console.log("meetings:", meetings);

    const [joinCode, setJoinCode] = useState("");

    
  return (
    <div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex gap-4 mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white">
                + Start Meeting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <h2 className="text-lg font-bold mb-2">Start a New Meeting</h2>
              <Input placeholder="Meeting Title" className="mb-4" />
              <Button className="w-full bg-blue-600 text-white">
                Start Now
              </Button>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2">
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter Room Code"
              className="w-48"
            />
            <Link to="/joinRoom">
              <Button className="bg-green-600 text-white">Join Room</Button>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Upcoming Meetings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetings.map((meeting, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-medium text-lg">
                    Team Sync #{meeting.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {meeting.date} at {meeting.time}
                  </p>
                  <Link to="/">
                    <Button variant="outline" className="mt-2">
                      Join
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPanel
