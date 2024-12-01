import { useState, useEffect } from "react";
import OrderTable from "@/components/Orders/OrderTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

interface User {
  firstName: string;
  lastName: string;
}

interface Chef {
  name:string;
}

interface Order {
  _id: string;
  user: User;
  planID: string;
  totalPeople: number;
  morningMealTime: string;
  eveningMealTime: string;
  chefDayOff: string;
  planStartDate: string;
  baseAmount: number;
  extraPersonAmount: number;
  discountAmount: number;
  totalAmount: number;
  razorpayOrderId: string;
  status: "pending" | "confirmed" | "cancelled" | "failed";
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  chef?: Chef;
  __v: number;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<keyof Order>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    console.log("hello",currentPage)
    try {
      const response = await axios.get(
        `/admin/orders?page=${currentPage}&limit=${pageSize}`,
        {
          headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      );
      if (response.data.success) {
        setOrders(response.data.data.orders);
        setTotalPages(response.data.data.totalPages);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (error) {
      setError("An error occurred while fetching orders.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => setSearchTerm(term);

  const handleSort = (column: keyof Order) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if(isLoading){
    return <>Loading...</>
  }

  return (
    <Card>
      <CardContent>
        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <OrderTable
          orders={sortedOrders}
          searchTerm={searchTerm}
          setCurrentPage={setCurrentPage}
          handleSearch={handleSearch}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
          pageSize={pageSize}
          handlePageSizeChange={handlePageSizeChange}
          currentPage={currentPage}
          totalPages={totalPages}
          fetchOrders={fetchOrders}
        />
      </CardContent>
    </Card>
  );
};

export default Orders;
