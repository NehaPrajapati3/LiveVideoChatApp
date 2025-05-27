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

export default function AddClass() {
  useGetUsers()
  const users = useSelector((state) => state.auth.users || []);
  console.log("users:", users)

 

  const userOptions = users.map((user) => ({
    value: user.userAuth.email,
    label: `${user.userInfo.fullName} (${user.userAuth.email})`,
  }));


  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    
  });

 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
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
          `${process.env.REACT_APP_API_URL}/api/v1/class/add`,
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
      description: "",
      price: "",
      
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
            Create New Class
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Class Title
              </label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Product Demo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input
                name="description"
                type="text"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Price Per Month
              </label>
              <Input
                name="price"
                type="text"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </div>

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
              Create
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
