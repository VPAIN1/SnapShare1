import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Camera, User, Sparkles } from "lucide-react";
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
import { updateProfilePicAPI, updateProfileAPI } from "@/services/api";

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

            const res = await updateProfilePicAPI(imageFormData);

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

            const res = await updateProfileAPI(formData);

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
        <div className="relative flex justify-center items-center min-h-[92vh] w-full overflow-x-hidden bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950 pt-24 pb-12 px-4">
            
            {/* Background Glowing Ambient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-4 relative z-10 my-auto">

                <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-gray-500 hover:text-gray-900 -ml-2 cursor-pointer"
                            onClick={() => navigate("/profile")}
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                    </div>

                    {/* Profile Image Upload Section inside Header */}
                    <div className="flex flex-col items-center mb-2">
                        <div className="relative w-24 h-24 mb-2">
                            <div className="w-full h-full rounded-full overflow-hidden bg-purple-100 flex items-center justify-center shadow-inner border-2 border-[#59168B]">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-[#59168B]" />
                                )}
                            </div>
                            <label
                                htmlFor="imageUpload"
                                style={{ backgroundColor: "#59168B" }}
                                className="absolute bottom-0 right-0 text-white p-2 rounded-full cursor-pointer shadow-lg hover:opacity-90 transition"
                            >
                                {uploading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Camera className="w-4 h-4" />
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
                        <span className="text-xs text-gray-500 font-medium">
                            {uploading ? "Uploading..." : "Click camera to change photo"}
                        </span>
                    </div>

                    <CardTitle className="text-2xl font-extrabold text-gray-900 text-center tracking-tight">
                        Update Profile
                    </CardTitle>
                    <CardDescription className="text-center text-gray-500 text-sm">
                        Edit your personal info and social links below
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-2">
                    <form onSubmit={handleSubmit} id="update-form">
                        <div className="space-y-4">

                            {/* Line 1: First Name & Last Name (Side by Side) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="First name"
                                        required
                                        className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Last name"
                                        required
                                        className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
                                    />
                                </div>
                            </div>

                            {/* Line 2: Email Address (Full Width - Disabled) */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="rounded-xl bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200"
                                />
                                <p className="text-xs text-gray-400">Email address cannot be changed.</p>
                            </div>

                            {/* Line 3: Mobile Number */}
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">Mobile Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="text"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Enter mobile number"
                                    className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
                                />
                            </div>

                            {/* Line 4: Instagram & Facebook Links */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="instagram" className="text-gray-700 font-medium">Instagram Link</Label>
                                    <Input
                                        id="instagram"
                                        name="instagram"
                                        type="url"
                                        value={formData.instagram}
                                        onChange={handleChange}
                                        placeholder="Instagram URL"
                                        className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="facebook" className="text-gray-700 font-medium">Facebook Link</Label>
                                    <Input
                                        id="facebook"
                                        name="facebook"
                                        type="url"
                                        value={formData.facebook}
                                        onChange={handleChange}
                                        placeholder="Facebook URL"
                                        className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
                                    />
                                </div>
                            </div>

                            {/* Line 5: Other Platform Link */}
                            <div className="space-y-2">
                                <Label htmlFor="otherPlatform" className="text-gray-700 font-medium">Other Platform Link</Label>
                                <Input
                                    id="otherPlatform"
                                    name="otherPlatform"
                                    type="url"
                                    value={formData.otherPlatform}
                                    onChange={handleChange}
                                    placeholder="Custom profile URL"
                                    className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
                                />
                            </div>

                        </div>
                    </form>
                </CardContent>

                <CardFooter className="pt-2 pb-2">
                    <Button
                        type="submit"
                        form="update-form"
                        disabled={loading || uploading}
                        style={{ backgroundColor: "#59168B" }}
                        className="w-full text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2 cursor-pointer"
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