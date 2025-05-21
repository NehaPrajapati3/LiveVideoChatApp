import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "lib/utils";
import toast from "react-hot-toast";
import axios from "axios";
import useGetUsers from "hooks/useGetUsers";
import { useSelector } from "react-redux";
import Select from "react-select";
import {Link} from "react-router-dom";

export default function ScheduleMeeting() {
  useGetUsers()
  const users = useSelector((state) => state.auth.users || []);
  console.log("users:", users)

 

  const userOptions = users.map((user) => ({
    value: user.userAuth.email,
    label: `${user.userInfo.fullName} (${user.userAuth.email})`,
  }));


  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: 45,
    participants: [""],
    isPrivate: false,
    requirePassword: false,
    password: "",
    agenda: "",
    timezone: "Asia/Kolkata",
    recordingEnabled: false,
    allowScreenShare: true,
    allowChat: true,
    waitingRoomEnabled: true,
    notificationsEnabled: true,
    meetingType: "one-on-one",
    roomType: "standard",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleParticipantChange = (index, value) => {
    const updated = [...form.participants];
    updated[index] = value;
    setForm({ ...form, participants: updated });
  };

  const addParticipant = () => {
    setForm({ ...form, participants: [...form.participants, ""] });
  };

  const removeParticipant = (index) => {
    const updated = form.participants.filter((_, i) => i !== index);
    setForm({ ...form, participants: updated });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      console.log(`form is: ${form}`);
      let res;
      // if (categoryToEdit?._id) {
      //   // Update Coupon
      //   res = await axios.put(
      //     `${process.env.REACT_APP_API_URL}/api/v1/meeting/edit/${categoryToEdit._id}`,
      //     newCategory,
      //     {
      //       headers: { "Content-Type": "application/json" },
      //       withCredentials: true,
      //     }
      //   );
      // } else {
        // Add new Coupon
        res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/meeting/create`,
          form,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      // }

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
      console.log(error);
    }

    // Reset form after submission
    setForm({
      title: "",
      date: "",
      time: "",
      duration: 45,
      participants: [""],
      isPrivate: false,
      requirePassword: false,
      password: "",
      agenda: "",
      timezone: "Asia/Kolkata",
      recordingEnabled: false,
      allowScreenShare: true,
      allowChat: true,
      waitingRoomEnabled: true,
      notificationsEnabled: true,
      meetingType: "one-on-one",
      roomType: "standard",
    });

    
  };

  return (
    <div className="flex justify-center mt-10 px-4 w-full h-max">
      <Card className="w-full max-w-2xl space-y-6">
        <form
          action=""
          encType="multipart/form-data"
          onSubmit={(e) => handleAdd(e)}
        >
          <h2 className="text-2xl font-semibold text-gray-800">
            Schedule a Meeting
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Meeting Title
              </label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Product Demo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <Input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <select
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-gray-300 text-sm px-3"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Participants
              </label>
              <Select
                isMulti
                options={userOptions}
                value={userOptions.filter((option) =>
                  form.participants.includes(option.value)
                )}
                onChange={(selected) =>
                  setForm((prev) => ({
                    ...prev,
                    participants: selected.map((s) => s.value),
                  }))
                }
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select participants..."
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-4">
              <span className="text-sm font-medium">Room Privacy:</span>
              <div className="flex gap-2">
                <Button
                  className={cn(
                    !form.isPrivate ? "bg-blue-600 text-white" : "bg-gray-200"
                  )}
                  onClick={() => setForm({ ...form, isPrivate: false })}
                >
                  Public
                </Button>
                <Button
                  className={cn(
                    form.isPrivate ? "bg-blue-600 text-white" : "bg-gray-200"
                  )}
                  onClick={() => setForm({ ...form, isPrivate: true })}
                >
                  Private
                </Button>
              </div>
            </div>

            {form.isPrivate && (
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requirePassword"
                    name="requirePassword"
                    checked={form.requirePassword}
                    onChange={handleChange}
                  />
                  <label htmlFor="requirePassword" className="text-sm">
                    Require Password
                  </label>
                </div>
                {form.requirePassword && (
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter meeting password"
                  />
                )}
              </div>
            )}

            {/* <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Meeting Type
              </label>
              <select
                name="meetingType"
                value={form.meetingType}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-gray-300 text-sm px-3"
              >
                <option value="one-on-one">One-on-One</option>
                <option value="group">Group</option>
                <option value="webinar">Webinar</option>
              </select>
            </div> */}

            {/* <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Room Type
              </label>
              <select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-gray-300 text-sm px-3"
              >
                <option value="standard">Standard</option>
                <option value="breakout">Breakout</option>
                <option value="roundtable">Round Table</option>
              </select>
            </div> */}
          </div>

          {/* Advanced Options */}
          {/* <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showAdvanced ? "▲ Hide Advanced Options" : "▼ Advanced Options"}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-3 text-sm text-gray-600">
                <div>
                  <label className="block mb-1">Agenda</label>
                  <Input
                    name="agenda"
                    value={form.agenda}
                    onChange={handleChange}
                    placeholder="Meeting agenda"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="recordingEnabled"
                    checked={form.recordingEnabled}
                    onChange={handleChange}
                  />
                  <label>Enable Recording</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="allowScreenShare"
                    checked={form.allowScreenShare}
                    onChange={handleChange}
                  />
                  <label>Allow Screen Sharing</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="allowChat"
                    checked={form.allowChat}
                    onChange={handleChange}
                  />
                  <label>Enable Chat</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="waitingRoomEnabled"
                    checked={form.waitingRoomEnabled}
                    onChange={handleChange}
                  />
                  <label>Enable Waiting Room</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="notificationsEnabled"
                    checked={form.notificationsEnabled}
                    onChange={handleChange}
                  />
                  <label>Enable Notifications</label>
                </div>
              </div>
            )}
          </div> */}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link to="/">
              <Button className="bg-gray-200 text-black hover:bg-gray-300">
                Cancel
              </Button>
            </Link>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              type="submit"
            >
              Schedule Meeting
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
