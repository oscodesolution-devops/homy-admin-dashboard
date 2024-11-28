import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useState } from "react";

// Define types for props
interface Plan {
  _id: string;
  type: string;
}

interface CouponFormProps {
  plans: Plan[];
  onCouponCreated: () => void;
}

// Define types for formData state
interface FormData {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  description: string;
  applicablePlans: string[];
  maxDiscount: number | null;
  isActive: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({ plans, onCouponCreated }) => {
    const [formData, setFormData] = useState<FormData>({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        applicablePlans: [],
        maxDiscount: null,
        isActive: true,
      });
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
           await axios.post("/coupon/create", formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          onCouponCreated();
          // Reset form after successful creation
          setFormData({
            code: "",
            description: "",
            discountType: "percentage",
            discountValue: 0,
            applicablePlans: [],
            maxDiscount: null,
            isActive: true,
          });
        } catch (error) {
          console.error("Coupon creation failed", error);
        }
      };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Coupon Code</Label>
        <Input
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <Label>Discount Type</Label>
        <Select
          value={formData.discountType}
          onValueChange={(value: "percentage" | "fixed") =>
            setFormData({ ...formData, discountType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Discount Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="discount-value">Discount Value</Label>
        <Input
          id="discount-value"
          type="number"
          min="0"
          value={formData.discountValue}
          onChange={(e) => setFormData({ 
            ...formData, 
            discountValue: Number(e.target.value) 
          })}
          required
        />
      </div>

      <div>
        <Label htmlFor="max-discount">Max Discount (Optional)</Label>
        <Input
          id="max-discount"
          type="number"
          value={formData.maxDiscount || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            maxDiscount: e.target.value ? Number(e.target.value) : null 
          })}
        />
      </div>
      <div>
        <Label>Applicable Plans</Label>
        <Select
          value={formData.applicablePlans.join(",")}
          onValueChange={(value: string) =>
            setFormData({
              ...formData,
              applicablePlans: value.split(","),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Plans" />
          </SelectTrigger>
          <SelectContent>
            {plans.map((plan) => (
              <SelectItem key={plan._id} value={plan._id}>
                {plan.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Create Coupon</Button>
    </form>
  );
};

export default CouponForm;
