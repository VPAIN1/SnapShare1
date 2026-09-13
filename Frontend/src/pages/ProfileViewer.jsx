import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Phone, Globe, Shield, Loader2, Share2, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const ProfileViewer = () => {
    const { email } = useParams(); // Grabs email from the URL route /profileviewer/:email
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // State for image popup modal

    useEffect(() => {
        const fetchUserProfileViewer = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await axios.get(`http://localhost:5000/api/users/profileviewer/${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data.success) {
                    setUser(res.data.user);
                }
            } catch (err) {
                console.error("Error fetching profile viewer data:", err);
                toast.error(err.response?.data?.message || "Failed to load user profile.");
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchUserProfileViewer();
        }
    }, [email, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <p className="text-gray-500 mb-4">User profile not found.</p>
                <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-start min-h-[calc(100vh-4rem)] bg-gray-50 mt-16 py-12 px-4">
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 items-start">

                {/* LEFT SIDE: Navigation / Back Button Card */}
                <Card className="w-full md:w-64 shadow-lg border-gray-100 shrink-0">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-gray-900">
                            Profile Viewer
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Viewing user details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {/* View User Posts Button */}
                        <Button
                            onClick={() => navigate(`/user-posts/${user.email}`)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-start gap-2.5 px-3"
                        >
                            <ImageIcon className="w-4 h-4" />
                            View All Posts
                        </Button>

                        {/* Back to Feed Button */}
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-start gap-2.5 px-3"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Feed
                        </Button>
                    </CardContent>
                </Card>

                {/* RIGHT SIDE: Profile Information Box */}
                <Card className="w-full flex-1 shadow-lg border-gray-100">
                    <CardHeader className="text-center pb-2">
                        {/* Clickable Profile Picture Container */}
                        <div
                            onClick={() => user.profilepic && setShowModal(true)}
                            className={`mx-auto bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-inner overflow-hidden border-2 border-blue-500 ${user.profilepic ? 'cursor-pointer hover:opacity-90 transition' : ''}`}
                            title={user.profilepic ? "Click to view photo" : ""}
                        >
                            {user.profilepic ? (
                                <img
                                    src={user.profilepic}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-blue-600" />
                            )}
                        </div>

                        <CardTitle className="text-2xl font-bold text-gray-900">
                            {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "User Profile"}
                        </CardTitle>
                        <CardDescription>
                            Viewing account details and social links
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="mt-2 space-y-3">
                        {/* Line 1: First Name & Last Name */}
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

                        {/* Line 2: Email ID */}
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

                        {/* Line 3: Mobile Number */}
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

                        {/* Line 4: Instagram & Facebook Links */}
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

                        {/* Line 5: Other Platform Link */}
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

            {/* INSTAGRAM-STYLE IMAGE POPUP MODAL */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative max-w-lg w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 bg-gray-900/80 hover:bg-gray-700 text-white p-2 rounded-full transition z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Header */}
                        <div className="w-full px-4 py-3 bg-gray-900 text-white text-sm font-semibold text-center border-b border-gray-800">
                            {user.firstName} {user.lastName}'s Profile Picture
                        </div>

                        {/* Big Image Viewer */}
                        <div className="w-full max-h-[75vh] flex items-center justify-center bg-black p-2">
                            <img
                                src={user.profilepic}
                                alt="Full Profile"
                                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileViewer;