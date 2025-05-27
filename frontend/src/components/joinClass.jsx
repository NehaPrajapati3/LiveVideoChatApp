import useGetClassrooms from "hooks/useGetClassRooms";
import React from "react";
import { useSelector } from "react-redux";
import { selectClassrooms } from "../redux/selectors";
import axios from "axios";
import { toast } from "react-hot-toast";

const classes = [
  { id: 1, title: "Full Body HIIT", price: 499, host: "Raj Fitness" },
  { id: 2, title: "Yoga for Beginners", price: 299, host: "Neha Yogi" },
  // Add more class data here
];

export default function ClassesTable() {

    useGetClassrooms();
    const classes = useSelector(selectClassrooms)

   

    // Enroll handler
    const enrollHandler = async (id) => {
      try {
        

        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/class/enroll/${id}`, 
          {},
          {
            withCredentials: true, 
          }
        );

        toast.success(res.data.message || "Enrolled successfully!");
        return res.data;
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Enrollment failed. Try again."
        );
        console.error("Enrollment Error:", error);
      }
    };
    


  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-left text-sm uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">S.No</th>
              <th className="px-6 py-4">Class Title</th>
              <th className="px-6 py-4">Class Price</th>
              <th className="px-6 py-4">Host Name</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
            {classes.map((cls, index) => (
              <tr key={cls.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{cls.title}</td>
                <td className="px-6 py-4">₹{cls.price}</td>
                <td className="px-6 py-4">{cls.adminId?.userInfo?.fullName}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => enrollHandler(cls._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Enroll
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
