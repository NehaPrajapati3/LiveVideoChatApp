import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConflictNotifications } from "../redux/coflictNotificationSlice";

function useGetConflictNotifications() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchConflictNotifications = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/conflict/get`
        );
        console.log("Fetched response is", res);
        dispatch(setConflictNotifications(res.data.notifications));
        console.log(
          "Dispatched setConflictNotifications with:",
          res.data.notifications
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchConflictNotifications();
  }, [dispatch]);
}

export default useGetConflictNotifications;
