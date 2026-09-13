import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfileAPI } from "@/services/api";
import { User, Mail, Phone, Globe, Edit, Shield, LogOut, Loader2, Share2, X, Sparkles } from "lucide-react";
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
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const res = await getUserProfileAPI();

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-change"));
        toast.success("Logged out successfully");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950">
                <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="relative min-h-[92vh] w-full overflow-x-hidden bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950 pt-24 pb-16 px-4">
            
            {/* Background Glowing Ambient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col md:flex-row gap-6 items-start">

                {/* LEFT SIDE: Menu Navigation Card */}
                <Card className="w-full md:w-72 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-2 shrink-0">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#59168B]" />
                            Dashboard
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                            Manage your account settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 pt-1">
                        {/* Update Profile Button */}
                        <Button
                            onClick={() => navigate("/update-profile")}
                            style={{ backgroundColor: "#59168B" }}
                            className="w-full text-white hover:opacity-90 transition flex items-center justify-start gap-2.5 px-4 py-2.5 rounded-xl font-semibold shadow-md cursor-pointer"
                        >
                            <Edit className="w-4 h-4" />
                            Update Profile
                        </Button>

                        {/* CONDITIONAL ADMIN PANEL BUTTON */}
                        {user.role === "admin" && (
                            <Button
                                variant="outline"
                                onClick={() => navigate("/admin-panel")}
                                className="w-full border-purple-200 text-[#59168B] hover:bg-purple-50 flex items-center justify-start gap-2.5 px-4 py-2.5 rounded-xl font-semibold cursor-pointer"
                            >
                                <Shield className="w-4 h-4 text-[#59168B]" />
                                Admin Panel
                            </Button>
                        )}

                        {/* Sign Out Button */}
                        <Button
                            variant="outline"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-start gap-2.5 px-4 py-2.5 rounded-xl font-semibold mt-4 cursor-pointer transition"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>

                {/* RIGHT SIDE: Profile Information Box */}
                <Card className="w-full flex-1 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-2">
                    <CardHeader className="text-center pb-2">
                        {/* Clickable Profile Picture Container */}
                        <div 
                            onClick={() => user.profilepic && setShowModal(true)}
                            className={`mx-auto bg-purple-100 w-24 h-24 rounded-2xl flex items-center justify-center mb-3 shadow-inner overflow-hidden border-2 border-purple-200 text-[#59168B] ${user.profilepic ? 'cursor-pointer hover:opacity-90 transition' : ''}`}
                            title={user.profilepic ? "Click to view photo" : ""}
                        >
                            {user.profilepic ? (
                                <img 
                                    src={user.profilepic} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <User className="w-12 h-12" />
                            )}
                        </div>

                        <CardTitle className="text-2xl font-extrabold text-gray-900">
                            My Profile
                        </CardTitle>
                        <CardDescription className="text-gray-500 text-sm">
                            View and manage your personal account details & links
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="mt-2 space-y-3 pt-2">
                        {/* Line 1: First Name & Last Name (Side by Side) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
                                <div className="bg-purple-100 p-2.5 rounded-xl mr-3 text-[#59168B]">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">First Name</p>
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {user.firstName || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
                                <div className="bg-purple-100 p-2.5 rounded-xl mr-3 text-[#59168B]">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Last Name</p>
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {user.lastName || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Line 2: Email ID (Full Width) */}
                        <div className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
                            <div className="bg-purple-100 p-2.5 rounded-xl mr-3 text-[#59168B]">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden w-full">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    {user.email || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Line 3: Mobile Number (Full Width) */}
                        <div className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
                            <div className="bg-purple-100 p-2.5 rounded-xl mr-3 text-[#59168B]">
                                <Phone className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden w-full">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mobile Number</p>
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    {user.phoneNumber || "Not Provided"}
                                </p>
                            </div>
                        </div>

                        {/* Line 4: Instagram & Facebook Links (Side by Side) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
                                <div className="bg-pink-100 p-2.5 rounded-xl mr-3 text-pink-600">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden w-full">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Instagram</p>
                                    {user.instagram ? (
                                        <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#59168B] hover:underline truncate block">
                                            {user.instagram}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-400">Not Provided</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
                                <div className="bg-blue-100 p-2.5 rounded-xl mr-3 text-blue-600">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div className="overflow-hidden w-full">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Facebook</p>
                                    {user.facebook ? (
                                        <a href={user.facebook} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#59168B] hover:underline truncate block">
                                            {user.facebook}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-semibold text-gray-400">Not Provided</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Line 5: Other Platform Link (Full Width) */}
                        <div className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm">
                            <div className="bg-purple-100 p-2.5 rounded-xl mr-3 text-[#59168B]">
                                <Share2 className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden w-full">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Other Platform Link</p>
                                {user.otherPlatform ? (
                                    <a href={user.otherPlatform} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#59168B] hover:underline truncate block">
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
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
                    onClick={() => setShowModal(false)}
                >
                    <div 
                        className="relative max-w-lg w-full bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition z-10 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Header */}
                        <div className="w-full px-4 py-3 bg-gray-50 text-gray-900 text-sm font-bold text-center border-b border-gray-100">
                            {user.firstName} {user.lastName}'s Profile Picture
                        </div>

                        {/* Big Image Viewer */}
                        <div className="w-full max-h-[75vh] flex items-center justify-center bg-black/5 p-4">
                            <img 
                                src={user.profilepic} 
                                alt="Full Profile" 
                                className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-md"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;