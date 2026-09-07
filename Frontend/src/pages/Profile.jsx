import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Phone, Globe, Edit, Shield, LogOut, Link as LinkIcon, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const res = await axios.get("https://snapshare1.onrender.com/api/users/getuserprofile", {
                    withCredentials: true,
                });

                if (res.data.success) {
                    setUser(res.data.user);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                toast.error(err.response?.data?.message || "Failed to load profile.");
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex justify-center items-start min-h-[calc(100vh-4rem)] bg-gray-50 mt-16 py-12 px-4">

            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 items-start">

                {/* LEFT SIDE: Menu Navigation Card */}
                <Card className="w-full md:w-64 shadow-lg border-gray-100 shrink-0">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-gray-900">
                            Dashboard
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Manage your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {/* Update Profile Button */}
                        <Button
                            onClick={() => navigate("/update-profile")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-start gap-2.5 px-3"
                        >
                            <Edit className="w-4 h-4" />
                            Update Profile
                        </Button>

                        {/* CONDITIONAL ADMIN PANEL BUTTON */}
                        {user.role === "admin" && (
                            <Button
                                variant="outline"
                                onClick={() => navigate("/admin-panel")}
                                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center justify-start gap-2.5 px-3"
                            >
                                <Shield className="w-4 h-4 text-purple-600" />
                                Admin Panel
                            </Button>
                        )}

                        {/* Sign Out Button */}
                        <Button
                            variant="outline"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-start gap-2.5 px-3 mt-4"
                            onClick={() => {
                                localStorage.removeItem("user");
                                navigate("/login");
                            }}
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>

                {/* RIGHT SIDE: Profile Information Box */}
                <Card className="w-full flex-1 shadow-lg border-gray-100">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-inner overflow-hidden border-2 border-blue-500">
                            <User className="w-10 h-10 text-blue-600" />
                        </div>

                        <CardTitle className="text-2xl font-bold text-gray-900">
                            My Profile
                        </CardTitle>
                        <CardDescription>
                            View and manage your account details and social links
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="mt-2 space-y-3">
                        {/* Line 1: First Name & Last Name (Side by Side) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className="bg-blue-50 p-2 rounded-lg mr-2.5">
                                    <User className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">First Name</p>
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {user.firstName || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className="bg-blue-50 p-2 rounded-lg mr-2.5">
                                    <User className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Last Name</p>
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {user.lastName || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Line 2: Email ID (Full Width) */}
                        <div className="flex items-center p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div className="bg-blue-50 p-2 rounded-lg mr-2.5">
                                <Mail className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="overflow-hidden w-full">
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Email Address</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    {user.email || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Line 3: Mobile Number (Full Width) */}
                        <div className="flex items-center p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div className="bg-blue-50 p-2 rounded-lg mr-2.5">
                                <Phone className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="overflow-hidden w-full">
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Mobile Number</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    {user.phoneNumber || "Not Provided"}
                                </p>
                            </div>
                        </div>

                        {/* Line 4: Instagram & Facebook Links (Side by Side) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className="bg-pink-50 p-2 rounded-lg mr-2.5">
                                    <Globe className="w-4 h-4 text-pink-500" />
                                </div>
                                <div className="overflow-hidden w-full">
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Instagram</p>
                                    {user.instagram ? (
                                        <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline truncate block">
                                            {user.instagram}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-400">Not Provided</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <div className="bg-blue-50 p-2 rounded-lg mr-2.5">
                                    <Globe className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="overflow-hidden w-full">
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Facebook</p>
                                    {user.facebook ? (
                                        <a href={user.facebook} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline truncate block">
                                            {user.facebook}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-400">Not Provided</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Line 5: Other Platform Link (Full Width) */}
                        <div className="flex items-center p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div className="bg-purple-50 p-2 rounded-lg mr-2.5">
                                <Share2 className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="overflow-hidden w-full">
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Other Platform Link</p>
                                {user.otherPlatform ? (
                                    <a href={user.otherPlatform} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline truncate block">
                                        {user.otherPlatform}
                                    </a>
                                ) : (
                                    <p className="text-sm font-semibold text-gray-400">Not Provided</p>
                                )}
                            </div>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default Profile;