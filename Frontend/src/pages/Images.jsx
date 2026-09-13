import React, { useState } from "react";
import { addImageAPI } from "@/services/api";
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

      const res = await addImageAPI(data);

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
    <div className="relative flex justify-center items-center min-h-[92vh] px-4 overflow-hidden bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950 pt-24 pb-12">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-4 relative z-10 my-auto">
        
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-[#59168B] shadow-sm mb-1">
            <ImageIcon className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Create New Post
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm">
            Share your photos or videos with the SnapShare community (Max 5 files, up to 100MB each)
          </CardDescription>
        </CardHeader>

        <form onSubmit={submitHandler}>
          <CardContent className="space-y-4 pt-2">
            
            {/* Post Title */}
            <div className="space-y-2">
              <Label htmlFor="ImageName" className="text-gray-700 font-medium">Post Title</Label>
              <Input
                type="text"
                id="ImageName"
                name="ImageName"
                value={formData.ImageName}
                onChange={handleChange}
                placeholder="What's this about?"
                required
                className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="ImageDesc" className="text-gray-700 font-medium">Description</Label>
              <textarea
                id="ImageDesc"
                name="ImageDesc"
                value={formData.ImageDesc}
                onChange={handleChange}
                placeholder="Add a detailed caption..."
                rows="3"
                className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#59168B] focus-visible:border-[#59168B]"
                required
              />
            </div>

            {/* File Upload Box */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Upload Media</Label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-[#59168B] transition bg-purple-50/40">
                <Upload className="w-8 h-8 text-[#59168B] mb-2" />
                <span className="text-sm font-medium text-gray-700">Click to browse images or videos</span>
                <span className="text-xs text-gray-400 mt-1">Supports PNG, JPG, MP4, etc.</span>
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
                  <div key={index} className="relative rounded-xl overflow-hidden h-24 border border-gray-200 bg-gray-50 shadow-sm">
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

          <CardFooter className="pt-2 pb-2">
            <Button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#59168B" }}
              className="w-full text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
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