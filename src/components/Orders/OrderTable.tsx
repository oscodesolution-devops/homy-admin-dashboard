import React, { useState } from 'react';
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
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
}

interface Chef {
  firstname: string;
  lastname: string;
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
  status: 'pending' | 'confirmed' | 'cancelled' | 'failed';
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  chef?: Chef;
  __v: number;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

interface OrderTableProps {
  initialOrders: Order[];
  fetchOrders: ()=>void;
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
  failed: "bg-gray-100 text-gray-800"
};

const OrderTable: React.FC<OrderTableProps> = ({ initialOrders,fetchOrders }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<keyof Order>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const filteredOrders = initialOrders.filter(order => 
    order.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue === undefined || bValue === undefined) {
      return 0; // If either value is undefined, treat them as equal
    }
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedOrders = sortedOrders.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sortedOrders.length / pageSize);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSort = (): void => {
    if (sortColumn === "createdAt") {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn("createdAt");
      setSortDirection("asc");
    }
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
                onClick={handleSort}
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
            {paginatedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order._id.slice(-6)}</TableCell>
                <TableCell>{`${order.user.firstName} ${order.user.lastName}`}</TableCell>
                <TableCell>{order.totalPeople}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Morning: {order.morningMealTime}</div>
                    <div>Evening: {order.eveningMealTime}</div>
                  </div>
                </TableCell>
                <TableCell>{order.chefDayOff}</TableCell>
                <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {order.chef ? 
                    <span className="text-sm text-gray-600">{`${order.chef.firstname} ${order.chef.lastname}`}</span> :
                    <AssignChefButton orderId={order._id} fetchOrders={fetchOrders}/>
                  }
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, sortedOrders.length)} of{" "}
          {sortedOrders.length} entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;