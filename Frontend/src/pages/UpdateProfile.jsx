import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

const UpdateProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    // Form state updated with phone and social links
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        instagram: "",
        facebook: "",
        otherPlatform: "",
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setFormData({
                firstName: storedUser.firstName || "",
                lastName: storedUser.lastName || "",
                email: storedUser.email || "",
                phoneNumber: storedUser.phoneNumber || "",
                instagram: storedUser.instagram || "",
                facebook: storedUser.facebook || "",
                otherPlatform: storedUser.otherPlatform || "",
            });
            
            // Match schema key: profilepic
            if (storedUser.profilepic) {
                setProfileImage(storedUser.profilepic);
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview locally before upload finishes
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);

        const imageFormData = new FormData();
        imageFormData.append("profilepic", file);

        try {
            setUploading(true);
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");

            const res = await axios.patch(
                "http://localhost:5000/api/users/update-profile-pic",
                imageFormData,
                {
                    headers: { 
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            if (res.data.success) {
                toast.success("Profile picture updated successfully!");
                const newPicUrl = res.data.user?.profilepic || res.data.profilepic;
                setProfileImage(newPicUrl);
                
                const updatedUser = { 
                    ...storedUser, 
                    profilepic: newPicUrl 
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error(error.response?.data?.message || "Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");

            const res = await axios.patch(
                "http://localhost:5000/api/users/update-profile",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                toast.success("Profile updated successfully!");

                if (res.data.user) {
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                } else {
                    const updatedUser = { ...storedUser, ...formData };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }

                navigate("/profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-50 mt-16 py-12 px-4">
            <Card className="w-full max-w-md shadow-lg border-gray-100">

                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-gray-500 hover:text-black -ml-2"
                            onClick={() => navigate("/profile")}
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                    </div>

                    {/* Profile Image Upload Section inside Header */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative w-20 h-20 mb-2">
                            <div className="w-full h-full rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shadow-inner border-2 border-blue-500">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-blue-600" />
                                )}
                            </div>
                            <label
                                htmlFor="imageUpload"
                                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full cursor-pointer shadow-md transition"
                            >
                                {uploading ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Camera className="w-3 h-3" />
                                )}
                            </label>
                            <input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                        <span className="text-xs text-gray-500">
                            {uploading ? "Uploading..." : "Click camera to change photo"}
                        </span>
                    </div>

                    <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                        Update Profile
                    </CardTitle>
                    <CardDescription className="text-center">
                        Edit your personal info and social links below
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} id="update-form">
                        <div className="space-y-4">

                            {/* Line 1: First Name & Last Name (Side by Side) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="First name"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Last name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Line 2: Email Address (Full Width - Disabled) */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-gray-100 cursor-not-allowed text-gray-500"
                                />
                                <p className="text-xs text-gray-400">Email address cannot be changed.</p>
                            </div>

                            {/* Line 3: Mobile Number */}
                            <div className="grid gap-2">
                                <Label htmlFor="phoneNumber">Mobile Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Enter mobile number"
                                />
                            </div>

                            {/* Line 4: Instagram & Facebook Links */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="instagram">Instagram Link</Label>
                                    <Input
                                        id="instagram"
                                        name="instagram"
                                        type="url"
                                        value={formData.instagram}
                                        onChange={handleChange}
                                        placeholder="Instagram URL"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="facebook">Facebook Link</Label>
                                    <Input
                                        id="facebook"
                                        name="facebook"
                                        type="url"
                                        value={formData.facebook}
                                        onChange={handleChange}
                                        placeholder="Facebook URL"
                                    />
                                </div>
                            </div>

                            {/* Line 5: Other Platform Link */}
                            <div className="grid gap-2">
                                <Label htmlFor="otherPlatform">Other Platform Link</Label>
                                <Input
                                    id="otherPlatform"
                                    name="otherPlatform"
                                    type="url"
                                    value={formData.otherPlatform}
                                    onChange={handleChange}
                                    placeholder="Custom profile URL"
                                />
                            </div>

                        </div>
                    </form>
                </CardContent>

                <CardFooter>
                    <Button
                        type="submit"
                        form="update-form"
                        disabled={loading || uploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </CardFooter>

            </Card>
        </div>
    );
};

export default UpdateProfile;