import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import Swal from "sweetalert2";

interface AddPostFormProps {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>; // ✅ Correct Type
  }
export default function AddPostForm({setShowForm}:AddPostFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({ postDescription: "" });
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file)); // Image preview URL create karna
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPending(true);
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("postDescription", formData.postDescription);

    if (fileInputRef.current?.files?.[0]) {
      formDataToSend.append("postImage", fileInputRef.current.files[0]);
    }

    try {
      const response = await axios.post("/post/createPostByAdmin", formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Post created successfully!",
            showConfirmButton: false,
            timer: 1500
          });

        setFormData({ postDescription: "" });
        setImagePreview(null); // Reset image preview
        setShowForm(false)
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setError(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      setError("Failed to create post. Please try again.");
      console.error("Error:", error);
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        {/* Image Preview Centered */}
        {imagePreview && (
          <div className="flex justify-center">
            <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border" />
          </div>
        )}

        <label htmlFor="postImage" className="text-sm font-medium block text-center mt-2">Upload Image</label>
        <Input id="postImage" name="postImage" type="file" required ref={fileInputRef} onChange={handleFileChange} className="mx-auto block" />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea
          id="description"
          name="postDescription"
          placeholder="Enter description"
          required
          value={formData.postDescription}
          onChange={handleInputChange}
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
}
