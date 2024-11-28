import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Define chef specialties
const specialities = ["Vegetarian", "Vegan", "Keto", "Low-Carb", "Gluten-Free"];

// Define validation schema using yup
const schema = yup.object().shape({
  firstname: yup.string().max(100).required("First name is required"),
  lastname: yup.string().max(100).required("Last name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(8).max(100).required("Password is required"),
  experience: yup.number().min(0, "Experience cannot be negative").required("Experience is required"),
  rating: yup.number().min(0).max(5).required("Rating is required"),
  speciality: yup.array().of(yup.string()).required("At least one speciality is required"),

});

interface ChefModalProps {
  fetchChefs?: () => void;
}

const ChefModal = ({ fetchChefs }: ChefModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize the form with validation schema
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      experience: 0,
      rating: 0,
      speciality: [] as string[],
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axios.post("/admin/chef", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create chef");
      }

      setIsOpen(false);
      fetchChefs?.();
      form.reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Add Chef</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Chef</DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField name="firstname" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="lastname" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} type="email" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="password" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input {...field} type="password" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="experience" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience (years)</FormLabel>
                  <FormControl><Input {...field} type="number" min="0" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="rating" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (0-5)</FormLabel>
                  <FormControl><Input {...field} type="number" min="0" max="5" step="0.1" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="speciality" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialities</FormLabel>
                  <div className="space-y-2">
                    {specialities.map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value.includes(spec)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...field.value, spec]
                              : field.value.filter((value) => value !== spec);
                            field.onChange(updatedValue);
                          }}
                        />
                        <label className="text-sm">{spec}</label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Chef"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChefModal;
