import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Define types for form data
type ChefFormData = {
  name: string;
  gender: "male" | "female" | "other";
  profilePicture: File;
  canCook: boolean;
  previousWorkplace: string[];
  readyForHomeKitchen: boolean;
  preferredCities: string[];
  currentCity: string;
  currentArea: string;
  cuisines: string[];
  travelMode: "metro" | "bike";
  cooksNonVeg: boolean;
  readingLanguage: string;
  experienceYears: string;
  currentSalary: number;
  PhoneNo:number;
};

// Constants remain the same
const cuisines = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Mexican",
  "Continental",
  "Thai",
  "Japanese",
  "Turkish",
  "Lebanese",
  "Gujarati",
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"];

// Define validation schema using yup
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  gender: yup
    .string()
    .oneOf(["male", "female", "other"])
    .required("Gender is required"),
  profilePicture: yup.mixed<File>().required("Profile picture is required"),

  canCook: yup.boolean().required("Please answer if you can cook"),
  previousWorkplace: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one previous workplace"),
  readyForHomeKitchen: yup
    .boolean()
    .required("Please answer if you're ready to work in a home kitchen"),
  preferredCities: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one preferred city"),
  currentCity: yup.string().required("Current city is required"),
  currentArea: yup.string().required("Current area is required"),
  cuisines: yup.array().of(yup.string()).min(1, "Select at least one cuisine"),
  travelMode: yup
    .string()
    .oneOf(["metro", "bike"])
    .required("Travel mode is required"),
  cooksNonVeg: yup
    .boolean()
    .required("Please answer if you cook non-vegetarian food"),
  readingLanguage: yup.string().required("Reading language is required"),
  experienceYears: yup.string().required("Years of experience is required"),
  currentSalary: yup
    .number()
    .positive("Salary must be positive")
    .required("Current salary is required"),
});

interface ChefModalProps {
  fetchChefs?: () => void;
}

const ChefModal = ({ fetchChefs }: ChefModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize the form with validation schema
  const formMethods = useForm<ChefFormData | any>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      gender: undefined,
      profilePicture: undefined,
      resume: undefined,
      characterCertificate: undefined,
      canCook: false,
      previousWorkplace: [],
      readyForHomeKitchen: false,
      preferredCities: [],
      currentCity: "",
      currentArea: "",
      cuisines: [],
      travelMode: undefined,
      cooksNonVeg: false,
      readingLanguage: "",
      experienceYears: "",
      currentSalary: 0,
      PhoneNo:0
    },
  });

  const onSubmit: SubmitHandler<ChefFormData> = async (data) => {

    try {
      console.log("fff", data)
      setIsLoading(true);
      setError("");

      const formData = new FormData();
      for (const key in data) {
        const value = data[key as keyof ChefFormData];
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }
      console.log("hello")
      const response = await axios.post("/admin/chef", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create chef");
      }

      setIsOpen(false);
      fetchChefs?.();
      formMethods.reset();
    } catch (err: any) {
      setError(err.message);
      console.log("ff")
    } finally {
      setIsLoading(false);
      setIsOpen(false)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Chef</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Chef</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...formMethods}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              console.log("hello", formMethods.getValues())
              onSubmit(formMethods.getValues())
            }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              {/* First Column: Personal and Contact Details */}
              <FormField
                name="name"
                control={formMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="gender"
                control={formMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="profilePicture"
                control={formMethods.control}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...field}
                        onChange={(e) => {
                          onChange(e.target.files ? e.target.files[0] : null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              <FormField
                name="currentCity"
                control={formMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select current city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="PhoneNo"
                control={formMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PhoneNo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="without +91 (country code)"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <div className="space-y-4">
              {/* Second Column: Work Details, Skills, Experience */}
              <FormField
                name="currentArea"
                control={formMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Area</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="cuisines"
                control={formMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisines</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {cuisines.map((cuisine) => (
                        <div
                          key={cuisine}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={field.value.includes(cuisine)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...field.value, cuisine]
                                : field.value.filter(
                                  (value: any) => value !== cuisine
                                );
                              field.onChange(updatedValue);
                            }}
                          />
                          <label className="text-sm">{cuisine}</label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="experienceYears"
                control={formMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cooking Experience</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="less_than_5">
                          Less than 5 years
                        </SelectItem>
                        <SelectItem value="5_to_10">5 to 10 years</SelectItem>
                        <SelectItem value="10_to_15">10 to 15 years</SelectItem>
                        <SelectItem value="more_than_15">
                          More than 15 years
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="travelMode"
                control={formMethods.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel Mode</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select travel mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="metro">Metro</SelectItem>
                        <SelectItem value="bike">Bike/Scooty</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />



              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="canCook"
                  control={formMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Can Cook?</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span>Yes</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="cooksNonVeg"
                  control={formMethods.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cooks Non-Veg?</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span>Yes</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="col-span-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChefModal;
