import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the type for image objects
interface Image {
  _id: string;  
  imageUrl: string;
}

const Api = axios.create({
  baseURL: "http://localhost:3000/", // Set a different baseURL here
});

const ImageGallery: React.FC = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<Image[]>([]); // Define images as an array of `Image`
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Define selectedFile as `File | null`
  const [isDialogOpen,setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchImages();
  }, []);

  // Fetch images from the server
  const fetchImages = async (): Promise<void> => {
    try {
      const response = await Api.get("/images");
       // Specify response type as `Image[]`
      setImages(response.data.data.images);
    } catch (error: any) {
        console.log(error)
      // Use `any` to capture potential error shapes
      toast({
        title: "Error fetching images",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle file selection
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // Handle image upload
  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please choose an image to upload",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await Api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchImages();
      setSelectedFile(null);
      toast({
        title: "Upload Successful",
        description: "Image uploaded to gallery",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }finally{
        setIsDialogOpen(false)
    } 
  };

  // Handle image deletion
  const handleDelete = async (imageId: string): Promise<void> => {
    try {
      await Api.delete(`/images/${imageId}`);
      fetchImages();
      toast({
        title: "Image Deleted",
        description: "Image removed from gallery",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } 
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" /> Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Image</DialogTitle>
              </DialogHeader>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <Button onClick={handleUpload}>Upload</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {images?.map((image) => (
            <div key={image._id} className="relative group">
              <img
                src={image.imageUrl}
                alt={image.imageUrl}
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(image._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageGallery;
