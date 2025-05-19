import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMeetings } from "../redux/meetingSlice";

function useGetScheduledMeetings() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchScheduledMeetings = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/meeting/getMeetings`
        );
        console.log("Fetched meeting response is", res);
        dispatch(setMeetings(res.data));
        console.log("Dispatched setMeetings with:", res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchScheduledMeetings();
  }, [dispatch]);
}

export default useGetScheduledMeetings;
