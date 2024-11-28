import UserTable from "@/components/Users/UserTable";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber: number;
  isNewUser: boolean;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    users: User[];
    totalPages: number;
    currentPage: number;
  };
  error: any;
  status: {
    code: number;
    message: string;
  };
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(`admin/users?page=${currentPage}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError(response.data.status.message);
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 h-full flex items-center justify-center">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 h-full flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-full">
      <main className="p-4 md:p-8">
      
        
        <UserTable data={users} type="user" />

        {totalPages > 1 && (
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;