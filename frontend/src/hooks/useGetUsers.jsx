import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUsers } from "../redux/authSlice";

function useGetUsers() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user/getAll`
        );
        console.log("Fetched response is", res);
        dispatch(setUsers(res.data));
        console.log("Dispatched setUsers with:", res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [dispatch]);
}

export default useGetUsers;
