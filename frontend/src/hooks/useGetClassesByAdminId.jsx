import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setClassrooms } from "../redux/classSlice";

function useGetClassroomsByAdminId() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/class/allByAdminId`
        );
       // console.log("Fetched response is", res);
        dispatch(setClassrooms(res.data.items));
        //console.log("Dispatched setClassrooms with:", res.data.items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClassrooms();
  }, [dispatch]);
}

export default useGetClassroomsByAdminId;
