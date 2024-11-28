import CouponForm from "@/components/Coupon/CouponForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Define types for API responses
interface Plan {
  _id: string;
  type: string;
}

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  applicablePlans: Plan[];
  isActive: boolean;
}

// Main Coupon Management Component
const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const fetchCouponsAndPlans = async () => {
    try {
      const [couponsRes, plansRes] = await Promise.all([
        axios.get<{ data: Coupon[] }>("/coupon/get", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get<{ data: Plan[] }>("/plans/get", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
      setCoupons(couponsRes.data.data);
      setPlans(plansRes.data.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const handleDeactivateCoupon = async (couponId: string) => {
    try {
      await axios.patch(
        `/coupon/deactivate/${couponId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchCouponsAndPlans();
    } catch (error) {
      console.error("Coupon deactivation failed", error);
    }
  };

  useEffect(() => {
    fetchCouponsAndPlans();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <CouponForm
              plans={plans}
              onCouponCreated={() => {
                fetchCouponsAndPlans()
                setIsDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Applicable Plans</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>
                  {coupon.discountValue}
                  {coupon.discountType === "percentage" ? "%" : "₹"}
                </TableCell>
                <TableCell>
                  {coupon.applicablePlans.map((plan) => plan.type).join(", ")}
                </TableCell>
                <TableCell>{coupon.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate Coupon?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will deactivate the coupon and prevent its future use.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeactivateCoupon(coupon._id)}
                        >
                          Deactivate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CouponManagement;
