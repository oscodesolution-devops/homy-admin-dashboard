import ChefModal from "@/components/Chefs/ChefModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the User type
interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: number;
  isNewUser?: boolean;
  address?: string;
  experience?: string;
  rating?: number | string;
  speciality?: string; // converting array to string
  status?: string;
  verificationStatus:string;
  createdAt?: string;
  updatedAt?: string;
}

// Define props interface
interface UserTableProps {
  data: User[];
  type: string;
  fetchChefs?: () => void;
}

const UserTable: React.FC<UserTableProps> = ({ data, type, fetchChefs }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const filteredUsers = data.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.toString().includes(searchTerm)
  );

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`, { state: { role: type } });
  };
  const handleDeleteChef = async (chefId: string) => {
    try {
      const response = await axios.delete(`/admin/chef/${chefId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create chef");
      }
      // if(type=='che')
      fetchChefs?.();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className=" flex items-center justify-between px-4">
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {type == "chef" && <ChefModal fetchChefs={fetchChefs} />}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>{type == "chef" ? "Rating" : "Phone Number"}</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user._id}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {type == "chef" ? user.rating : user.phoneNumber}
              </TableCell>
              <TableCell>{user.verificationStatus}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleUserClick(user._id)}
                  variant="outline"
                  size="sm"
                >
                  View Profile
                </Button>
                {type == "chef" && (
                  <Button
                    onClick={() => handleDeleteChef(user._id)}
                    variant="outline"
                    size="sm"
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
