import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Chef {
  _id: string;
  firstname: string;
  lastname: string;
}

interface AssignChefButtonProps {
  orderId: string;
  fetchOrders:()=>void;
}

export function AssignChefButton({ orderId, fetchOrders }: AssignChefButtonProps) {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [selectedChef, setSelectedChef] = useState<string | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/chefs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setChefs(response.data.data.chefs);
      } else {
        setError(response.data.status.message);
      }
    } catch (err) {
      setError("Failed to fetch chefs");
      console.error("Error fetching chefs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedChef) return;

    setAssigning(true);
    try {
      const response = await axios.post(`/admin/orders/${orderId}/assign-chef`,
        { chefId: selectedChef },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response)
      if (response.status==200) {
        console.log("Chef assigned successfully:", response.data);
        setIsOpen(false);
        fetchOrders();
        setSelectedChef(undefined);
      } else {
        console.error("Failed to assign chef:", response.data.status.message);
        setError(response.data.status.message);
      }
    } catch (err) {
      setError("Failed to assign chef");
      console.error("Error assigning chef:", err);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Assign Chef</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Chef to Order {orderId}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {loading ? (
            <div>Loading chefs...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <Select onValueChange={setSelectedChef}>
              <SelectTrigger>
                <SelectValue placeholder="Select a chef" />
              </SelectTrigger>
              <SelectContent>
                {chefs.map((chef) => (
                  <SelectItem key={chef._id} value={chef._id}>
                    {chef.firstname} {chef.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
         <Button onClick={handleAssign} disabled={!selectedChef || assigning}>
            {assigning ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
