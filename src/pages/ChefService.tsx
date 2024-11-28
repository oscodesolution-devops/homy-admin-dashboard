import UserTable from "@/components/Users/UserTable";
import { useEffect, useState } from "react";
import axios from "axios";

interface Chef {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  experience: number;
  rating: number;
  speciality: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    chefs: Chef[];
    totalPages: number;
    currentPage: number;
  };
  error: any;
  status: {
    code: number;
    message: string;
  };
}

const ChefService = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchChefs();
  }, [currentPage]);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(`/admin/chefs?page=${currentPage}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setChefs(response.data.data.chefs);
        setTotalPages(response.data.data.totalPages);
      } else {
        console.log(response.data.status.message)
        setError(response.data.status.message);
      }
    } catch (err) {
      setError('Failed to fetch chefs');
      console.error('Error fetching chefs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 h-full flex items-center justify-center">
        <div className="text-gray-600">Loading chefs...</div>
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

  const formatChefData = (chefs: Chef[]) => {
    return chefs.map(chef => ({
      _id: chef._id,
      firstName: chef.firstname, // mapping to match UserTable expected format
      lastName: chef.lastname,
      email: chef.email,
      experience: chef.experience,
      rating: chef.rating,
      speciality: chef.speciality.join(', '), // converting array to string
      status: chef.isActive ? 'Active' : 'Inactive'
    }));
  };

  return (
    <div className="bg-gray-100 h-full">
      <main className="p-4 md:p-8">
        

        <UserTable data={formatChefData(chefs)} type="chef" fetchChefs={fetchChefs} />

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

export default ChefService;