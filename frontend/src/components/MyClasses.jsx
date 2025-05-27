import React, {useState, useEffect}from 'react'
import axios from "axios";

function MyClasses() {

    const [enrolledClasses, setEnrolledClasses] = useState([]);

    useEffect(() => {
      const fetchEnrolled = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/class/enrolled`,
            {
              withCredentials: true,
            }
          );
          setEnrolledClasses(res.data.items || []);
        } catch (error) {
          console.log("Failed to fetch enrolled classes:", error);
        }
      };

      fetchEnrolled();
    }, []);

  return (
    <div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-left text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">S.No</th>
                <th className="px-6 py-4">Class Title</th>
                <th className="px-6 py-4">Class Price</th>
                <th className="px-6 py-4">Host Name</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
              {enrolledClasses.map((cls, index) => (
                <tr key={cls.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{cls.title}</td>
                  <td className="px-6 py-4">₹{cls.price}</td>
                  <td className="px-6 py-4">
                    {cls.adminId?.userInfo?.fullName}
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyClasses
