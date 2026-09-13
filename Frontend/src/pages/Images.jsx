import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";

const AddPost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ImageName: "",
    ImageDesc: "",
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      toast.error("You can only upload a maximum of 5 files.");
      return;
    }

    setFiles(selectedFiles);

    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.ImageName || !formData.ImageDesc || files.length === 0) {
      toast.error("Please fill in all fields and select at least one file.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("ImageName", formData.ImageName);
      data.append("ImageDesc", formData.ImageDesc);

      files.forEach((file) => {
        data.append("files", file);
      });

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/images/addimage",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Post uploaded successfully!");
        navigate("/home");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to upload post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-12 px-4">
      <Card className="w-full max-w-lg shadow-xl my-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-xl">Create New Post</CardTitle>
          </div>
          <CardDescription>
            Share your photos or videos with the SnapShare community (Max 5 files, up to 100MB each)
          </CardDescription>
        </CardHeader>

        <form onSubmit={submitHandler}>
          <CardContent className="space-y-4">
            
            {/* Post Title */}
            <div className="grid gap-2">
              <Label htmlFor="ImageName">Post Title</Label>
              <Input
                type="text"
                id="ImageName"
                name="ImageName"
                value={formData.ImageName}
                onChange={handleChange}
                placeholder="What's this about?"
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="ImageDesc">Description</Label>
              <textarea
                id="ImageDesc"
                name="ImageDesc"
                value={formData.ImageDesc}
                onChange={handleChange}
                placeholder="Add a detailed caption..."
                rows="3"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>

            {/* File Upload Box */}
            <div className="grid gap-2">
              <Label>Upload Media</Label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-purple-500 transition bg-muted/30">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Click to browse images or videos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Previews Grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {previews.map((src, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden h-24 border bg-muted">
                    {files[index]?.type.startsWith("video/") ? (
                      <video src={src} className="w-full h-full object-cover" />
                    ) : (
                      <img src={src} alt="preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}

          </CardContent>

          <CardFooter className="pt-2 pb-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Publish Post"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddPost;