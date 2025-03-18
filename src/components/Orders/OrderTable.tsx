import React from "react";
import { AssignChefButton } from "@/components/Orders/AssignChef";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
}

interface Chef {
  name: string;
}

interface Order {
  _id: string;
  user: User;
  planID: string;
  totalPeople: number;
  morningMealTime?: string;
  eveningMealTime?: string;
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

interface OrderTableProps {
  orders: Order[];
  searchTerm: string;
  handleSearch: (term: string) => void;
  sortColumn: keyof Order;
  sortDirection: "asc" | "desc";
  handleSort: (column: keyof Order) => void;
  pageSize: number;
  handlePageSizeChange: (size: number) => void;
  currentPage: number;
  totalPages: number;
  fetchOrders: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

interface StatusColorsType {
  [key: string]: string;
  pending: string;
  confirmed: string;
  cancelled: string;
  failed: string;
}

const statusColors: StatusColorsType = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  failed: "bg-gray-100 text-gray-800",
};

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  searchTerm,
  handleSearch,
  sortColumn,
  sortDirection,
  handleSort,
  pageSize,
  handlePageSizeChange,
  currentPage,
  setCurrentPage,
  totalPages,
  fetchOrders,
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by customer name"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Rows per page: {pageSize}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {[10, 20, 30, 40, 50].map((size) => (
              <DropdownMenuCheckboxItem
                key={size}
                checked={pageSize === size}
                onCheckedChange={() => handlePageSizeChange(size)}
              >
                {size} rows
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total People</TableHead>
              <TableHead>Meal Times</TableHead>
              <TableHead>Day Off</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => {
                  handleSort("createdAt");
                }}
              >
                Order Date
                {sortColumn === "createdAt" && (
                  <ChevronDown
                    className={`ml-2 h-4 w-4 inline ${
                      sortDirection === "desc" ? "transform rotate-180" : ""
                    }`}
                  />
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  {order._id.slice(-6)}
                </TableCell>
                <TableCell>{`${order.user.firstName} ${order.user.lastName}`}</TableCell>
                <TableCell>{order.totalPeople}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Morning: {order.morningMealTime?order.morningMealTime:"Not selected"}</div>
                    <div>Evening: {order.eveningMealTime?order.eveningMealTime:"Not selected"}</div>
                  </div>
                </TableCell>
                <TableCell>{order.chefDayOff}</TableCell>
                <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {order.chef ? (
                    <span className="text-sm text-gray-600">{`${order.chef.name}`}</span>
                  ) : (
                    // <></>
                    order.status=="confirmed"?
                    <AssignChefButton
                      orderId={order._id}
                      fetchOrders={fetchOrders}
                    />:""
                  )}
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, orders.length)} of {orders.length}{" "}
          entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage(()=>1); // Move to the first page
               // Fetch orders after updating the state
            }}
            disabled={currentPage === 1}
          >
        
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage((prev)=>prev - 1); // Move to the previous page
                
              }
            }}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("hello")
              if (currentPage < totalPages) {
                setCurrentPage((prev)=>prev+1); // Move to the next page
                
              }
            }}
            disabled={currentPage === totalPages}
          >
            
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentPage(()=>totalPages);
            }}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
