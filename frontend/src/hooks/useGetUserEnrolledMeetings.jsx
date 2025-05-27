import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserMeetings } from "../redux/meetingSlice";

function useGetUserEnrolledMeetings() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchScheduledMeetings = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/meeting/getUserMeetings`
        );
        console.log("Fetched meeting response is", res);
        dispatch(setUserMeetings(res.data.meetings));
        console.log("Dispatched setUserMeetings with:", res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchScheduledMeetings();
  }, [dispatch]);
}

export default useGetUserEnrolledMeetings;
