import React, { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { fetchAllPostsAPI, likePostAPI, addCommentAPI, deleteCommentAPI, sharePostAPI } from "@/services/api";
import { useFeedSocket } from "@/hooks/useFeedSocket";
import { MediaModal } from "@/components/modals/MediaModal";
import { PostActions } from "@/components/modals/PostActions"; 

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const navigate = useNavigate();

    const rawUser = localStorage.getItem("user") || localStorage.getItem("userInfo") || localStorage.getItem("currentUser");
    let currentUserId = localStorage.getItem("userId") || localStorage.getItem("Id") || localStorage.getItem("_id");
    if (!currentUserId && rawUser) {
        try { currentUserId = JSON.parse(rawUser)._id || JSON.parse(rawUser).id; }
        catch (e) { currentUserId = rawUser; }
    }

    useFeedSocket(setPosts, setSelectedMedia);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const res = await fetchAllPostsAPI();
                if (res.data.success) {
                    setPosts(res.data.images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                }
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load posts.");
                if (err.response?.status === 401) navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, [navigate]);

    const handleLike = async (postId) => {
        try { await likePostAPI(postId); }
        catch { toast.error("Failed to update like"); }
    };

    const handleAddComment = async (postId, text) => {
        try { await addCommentAPI(postId, text); }
        catch { toast.error("Failed to add comment"); }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            await deleteCommentAPI(postId, commentId);
            toast.success("Comment deleted");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete comment");
        }
    };

    const handleShare = async (postId, mediaUrl) => {
        try {
            await sharePostAPI(postId);
            navigator.clipboard.writeText(mediaUrl);
            toast.success("Post link copied & shared!");
        } catch { toast.error("Failed to share post"); }
    };

    const handleDownload = async (url, title) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${title || "media"}-${Date.now()}.${url.split(".").pop().split("?")[0] || "jpg"}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            toast.success("Download started!");
        } catch { window.open(url, "_blank"); }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950 w-full overflow-x-hidden">
                <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
            </div>
        );
    }

    return (
        <div className="relative min-h-[92vh] w-full overflow-x-hidden bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950 pt-24 pb-16 px-4">
            
            {/* Background Glowing Ambient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto w-full relative z-10 space-y-8">
                
                {/* Header Banner */}
                <div className="border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <span className="p-2.5 bg-white/10 rounded-2xl border border-white/15 text-purple-300">
                                <Sparkles className="w-6 h-6" />
                            </span>
                            SnapShare Community Feed
                        </h1>
                        <p className="text-purple-200/70 text-sm mt-1">
                            Explore live moments, interact with peer posts, and discover media globally in real-time.
                        </p>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-24 text-gray-400 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 max-w-lg mx-auto shadow-2xl p-6">
                        <ImageIcon className="w-12 h-12 mx-auto text-purple-400/50 mb-3" />
                        <p className="text-lg font-medium text-gray-200">No posts available.</p>
                        <p className="text-xs text-gray-400 mt-1">Be the first to share something amazing with the world!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {posts.flatMap((post) => {
                            const formattedDate = new Date(post.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
                            
                            // Safely extract populated user info
                            const userEmail = post.userId?.email || "user@example.com";
                            const userProfilePic = post.userId?.profilepic;
                            const firstLetter = userEmail.charAt(0).toUpperCase();

                            return post.Img.map((media, mediaIndex) => {
                                const isVideo = media.url.match(/\.(mp4|mov|webm|avi)$/i) || media.url.includes("video");
                                const openModalHandler = () => setSelectedMedia({ ...media, postId: post._id, userId: post.userId, isVideo, title: post.ImageName, desc: post.ImageDesc, userEmail, date: formattedDate, userProfilePic, comments: post.comments || [] });

                                return (
                                    <Card key={`${post._id}-${mediaIndex}`} className="bg-white/95 backdrop-blur-xl text-gray-900 border border-white/20 shadow-2xl overflow-hidden rounded-3xl flex flex-col justify-between w-full hover:border-purple-300 transition duration-300">
                                        <div>
                                            {/* User Header */}
                                            <CardHeader className="flex flex-row items-center gap-3 py-3.5 px-4 border-b border-gray-100">
                                                <div onClick={() => navigate(`/profileviewer/${userEmail}`)} className="w-11 h-11 rounded-full bg-purple-100 text-[#59168B] flex items-center justify-center font-bold cursor-pointer overflow-hidden border border-purple-200 shrink-0 shadow-sm">
                                                    {userProfilePic ? <img src={userProfilePic} className="w-full h-full object-cover" /> : firstLetter}
                                                </div>
                                                <div className="flex flex-col truncate cursor-pointer" onClick={() => navigate(`/profileviewer/${userEmail}`)}>
                                                    <span className="text-sm font-semibold text-gray-900 truncate hover:text-[#59168B] transition">{userEmail}</span>
                                                    <span className="text-xs text-gray-400">{formattedDate}</span>
                                                </div>
                                            </CardHeader>

                                            {/* Media Box */}
                                            <div onClick={openModalHandler} className="bg-black w-full flex items-center justify-center h-[320px] overflow-hidden cursor-pointer group relative">
                                                {isVideo ? <video src={media.url} muted playsInline controls className="w-full h-full object-contain pointer-events-auto" /> : <img src={media.url} alt={post.ImageName} className="w-full h-full object-contain transition duration-300 group-hover:scale-105" />}
                                            </div>
                                        </div>

                                        {/* Content & Actions */}
                                        <CardContent className="py-4 px-4 space-y-3">
                                            <div>
                                                <h2 className="font-bold text-base text-gray-900 truncate">{post.ImageName}</h2>
                                                <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{post.ImageDesc}</p>
                                            </div>

                                            {/* Reusable PostActions Component */}
                                            <div className="pt-2 border-t border-gray-100">
                                                <PostActions 
                                                    post={post} 
                                                    currentUserId={currentUserId} 
                                                    onLike={handleLike} 
                                                    onOpenModal={openModalHandler} 
                                                    onShare={() => handleShare(post._id, media.url)} 
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            });
                        })}
                    </div>
                )}

                <MediaModal
                    selectedMedia={selectedMedia}
                    currentUserId={currentUserId}
                    onClose={() => setSelectedMedia(null)}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                    onDownload={handleDownload}
                />
            </div>
        </div>
    );
};

export default Feed;