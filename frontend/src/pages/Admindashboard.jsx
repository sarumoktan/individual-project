import { useState, useEffect } from "react";
import { getAllUserApi,deleteUserById } from "../services/api";
import toast from "react-hot-toast";
import {useNavigate} from 'react-router';
 
const Admindashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
   
    const getAllUser = async () => {
      try {
        const response = await getAllUserApi();
        if (response?.data?.success) {
          setData(response?.data?.users);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
 
    getAllUser();
  }, []);
   const handleDelete = async (id) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;
      try {
        const response = await deleteUserById(id);
        if (response?.data?.success) {
          setData(prevData => prevData.filter(user => user.id !== id));
          return toast.success(response?.data?.message);
        }
      
        else{
          return toast.error(response?.data?.message);
        }
      }
      catch (error) {
        return toast.error(error?.response?.data?.message || "Something went wrong");
      }finally {
        setLoading(false);
      }
    }

      const handleEdit = (id) => {
      navigate(`/edituser/${id}`);
    }
 
 
  if (loading) return <p>Loading data...</p>;
 
  return (
    <table className="border border-gray-300 w-full text-left">
      <thead>
        <tr>
          <th className="border p-2">#</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Username</th>
          <th className="border p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user, index) => (
          <tr
            key={user.id}
            className={`${index % 2 === 0 ? "bg-gray-100" : ""} hover:bg-gray-200`}
          >
            <td className="border p-2">{index + 1}</td>
            <td className="border p-2">{user.email}</td>
            <td className="border p-2">{user.username}</td>
            <td className="border p-2">
              <button onClick={() => handleEdit(user.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button onClick={() => {handleDelete(user.id)}} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default Admindashboard;
 
 