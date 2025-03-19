import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Swal from 'sweetalert2';

interface Chef {
    _id: string;
    name: string;
    PhoneNo: string;
}

interface Ticket {
    _id: string;
    chef: Chef;
    subject: string;
    description: string;
    status: "pending" | "resolved" | "in-progress"; // Status को Enum भी बना सकते हैं
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponse {
    success: boolean;
    data: Ticket[];
    error: Record<string, unknown>;
    status: {
        code: number;
        message: string;
    };
}


const TicketPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTeckets();
    }, []);


    const fetchTeckets = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>('/tickets/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                console.log("Response Data:", response);
                setTickets(response.data.data);  // 'data' array ko set karna hoga
            } else {
                setError(response.data.status?.message);
            }
        } catch (err) {
            setError('Failed to fetch posts');
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    //     try {
    //         await axios.delete<ApiResponse>(`/post/${id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('token')}`,
    //             },
    //         });
    //         fetchPosts();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };


    const handleStatusChange = async (ticketId: string, newStatus: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You wanna change status!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.patch(`/tickets/${ticketId}/status`, 
                        { status: newStatus }, 
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
    
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Changed!",
                            text: "Your status has been changed.",
                            icon: "success"
                        });
                        fetchTeckets()
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Failed to update status.",
                            icon: "error"
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "Something went wrong. Please try again.",
                        icon: "error"
                    });
                    console.error("Error updating status:", error);
                }
            }
        });
    };
    

            


    if (loading) {
        return (
            <div className="bg-gray-100 h-full flex items-center justify-center">
                <div className="text-gray-600">Loading community posts...</div>
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
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Chef Name</TableHead>
                                {/* <TableHead>Posted By</TableHead> */}
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                {/* <TableHead>Action</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets?.map((ticket) => (
                                <TableRow key={ticket._id}>
                                    <TableCell>
                                        {ticket.chef.name}
                                    </TableCell>
                                    <TableCell>{ticket.chef.PhoneNo}</TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell>{ticket.description || 'No description'}</TableCell>
                                    <TableCell>
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 bg-white shadow-sm hover:bg-gray-100 transition-all"
                                        >
                                            <option value="pending" className="text-yellow-500">🟡 Pending</option>
                                            <option value="unresolved" className="text-red-500">❌ Unresolved</option>
                                            <option value="resolved" className="text-green-500">✅ Resolved</option>
                                        </select>
                                    </TableCell>



                                    <TableCell>{new Date(ticket.createdAt).toLocaleString()}</TableCell>
                                    {/* <TableCell>
                                        <Delete
                                            // onClick={() => deletePost(post._id)}
                                            className="cursor-pointer text-red-500"
                                        />
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            </main>
        </div>
    );
};

export default TicketPage;
