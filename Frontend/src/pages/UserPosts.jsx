import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostsViewerAPI } from "@/services/api";
import { Loader2, Image as ImageIcon, X, Download, ArrowLeft } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UserPosts = () => {
    const { email } = useParams(); // Grabs email from URL route /user-posts/:email
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const res = await getPostsViewerAPI(email);

                if (res.data.success) {
                    const sortedPosts = res.data.images.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setPosts(sortedPosts);
                }
            } catch (err) {
                console.error("Error fetching user posts:", err);
                if (err.response?.status === 404) {
                    setPosts([]); // Handle empty posts gracefully
                } else {
                    toast.error(err.response?.data?.message || "Failed to load posts.");
                }
                if (err.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchUserPosts();
        }
    }, [email, navigate]);

    // Handle file download helper
    const handleDownload = async (url, title) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            
            const extension = url.split(".").pop().split("?")[0] || "jpg";
            link.download = `${title || "media"}-${Date.now()}.${extension}`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            toast.success("Download started successfully!");
        } catch (error) {
            console.error("Download failed:", error);
            window.open(url, "_blank");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 relative mt-16">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <ImageIcon className="text-purple-500" /> Posts by {email}
                </h1>
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 text-gray-400 bg-gray-900/50 rounded-xl border border-gray-800 max-w-xl mx-auto">
                    <p>This user hasn't uploaded any posts yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.flatMap((post) => {
                        const username = post.userEmail ? post.userEmail.split("@")[0] : "user";
                        const firstLetter = username.charAt(0).toUpperCase();

                        const formattedDate = new Date(post.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        });

                        return post.Img.map((media, mediaIndex) => {
                            const isVideo = media.url.match(/\.(mp4|mov|webm|avi)$/i) || media.url.includes("video");

                            return (
                                <Card
                                    key={`${post._id}-${mediaIndex}`}
                                    className="bg-gray-900 text-white border-gray-800 shadow-xl overflow-hidden rounded-xl flex flex-col justify-between"
                                >
                                    <div>
                                        {/* TOP: User Profile */}
                                        <CardHeader className="flex flex-row items-center gap-3 py-3 px-4 border-b border-gray-800/60">
                                            <div 
                                                onClick={() => navigate(`/profileviewer/${post.userEmail}`)}
                                                className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner cursor-pointer hover:opacity-90 transition overflow-hidden border border-purple-500"
                                            >
                                                {post.userProfilePic ? (
                                                    <img 
                                                        src={post.userProfilePic} 
                                                        alt="Avatar" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    firstLetter
                                                )}
                                            </div>
                                            <div className="flex flex-col truncate">
                                                <span 
                                                    onClick={() => navigate(`/profileviewer/${post.userEmail}`)}
                                                    className="text-sm font-semibold text-gray-200 truncate cursor-pointer hover:text-purple-400 transition text-left"
                                                >
                                                    {post.userEmail}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formattedDate}
                                                </span>
                                            </div>
                                        </CardHeader>

                                        {/* CENTER: Clickable Media Container */}
                                        <div
                                            onClick={() => setSelectedMedia({ ...media, isVideo, title: post.ImageName, desc: post.ImageDesc, userEmail: post.userEmail, date: formattedDate, userProfilePic: post.userProfilePic })}
                                            className="bg-black w-full flex items-center justify-center h-[320px] overflow-hidden cursor-pointer group relative"
                                        >
                                            {isVideo ? (
                                                <video
                                                    src={media.url}
                                                    autoPlay
                                                    muted
                                                    playsInline
                                                    controls
                                                    className="w-full h-full object-contain pointer-events-auto"
                                                />
                                            ) : (
                                                <img
                                                    src={media.url}
                                                    alt={post.ImageName}
                                                    className="w-full h-full object-contain transition group-hover:scale-105"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* BOTTOM: Title & Caption */}
                                    <CardContent className="py-3 px-4 space-y-2">
                                        <h2 className="font-bold text-base text-gray-100 truncate">{post.ImageName}</h2>
                                        <p className="text-sm text-gray-300 line-clamp-2">
                                            {post.ImageDesc}
                                        </p>
                                    </CardContent>

                                </Card>
                            );
                        });
                    })}
                </div>
            )}

            {/* MODAL POPUP OVERLAY */}
            {selectedMedia && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden max-w-3xl w-full relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                        {/* Top Action Buttons (Download & Close) */}
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                            <button
                                onClick={() => handleDownload(selectedMedia.url, selectedMedia.title)}
                                title="Download Media"
                                className="bg-black/60 hover:bg-black text-white p-2 rounded-full transition flex items-center gap-1 text-xs px-3"
                            >
                                <Download className="w-4 h-4" /> Download
                            </button>
                            <button
                                onClick={() => setSelectedMedia(null)}
                                title="Close"
                                className="bg-black/60 hover:bg-black text-white p-2 rounded-full transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Media Content */}
                        <div className="bg-black max-h-[65vh] flex items-center justify-center overflow-hidden">
                            {selectedMedia.isVideo ? (
                                <video
                                    src={selectedMedia.url}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="w-full max-h-[65vh] object-contain"
                                />
                            ) : (
                                <img
                                    src={selectedMedia.url}
                                    alt={selectedMedia.title}
                                    className="w-full max-h-[65vh] object-contain"
                                />
                            )}
                        </div>

                        {/* Modal Footer Info */}
                        <div className="p-4 space-y-2 bg-gray-900">
                            <div className="flex items-center justify-between text-xs text-purple-400 font-medium">
                                <div 
                                    onClick={() => {
                                        setSelectedMedia(null);
                                        navigate(`/profileviewer/${selectedMedia.userEmail}`);
                                    }}
                                    className="flex items-center gap-2 cursor-pointer group"
                                >
                                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-purple-500">
                                        {selectedMedia.userProfilePic ? (
                                            <img src={selectedMedia.userProfilePic} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            selectedMedia.userEmail.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className="group-hover:underline">{selectedMedia.userEmail}</span>
                                </div>
                                <span className="text-gray-500">{selectedMedia.date}</span>
                            </div>
                            <h2 className="text-lg font-bold text-white">{selectedMedia.title}</h2>
                            <p className="text-sm text-gray-300">{selectedMedia.desc}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPosts;