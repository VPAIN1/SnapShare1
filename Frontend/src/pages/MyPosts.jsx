import React, { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon, AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchMyPostsAPI, deletePostAPI, likePostAPI, addCommentAPI, deleteCommentAPI, sharePostAPI } from "@/services/api";
import { useFeedSocket } from "@/hooks/useFeedSocket";
import { PostCard } from "@/components/feed/PostCard";
import { MediaModal } from "@/components/modals/MediaModal";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);

  // Retrieve User ID safely
  const rawUser = localStorage.getItem("user") || localStorage.getItem("userInfo") || localStorage.getItem("currentUser");
  let currentUserId = localStorage.getItem("userId") || localStorage.getItem("Id") || localStorage.getItem("_id");

  if (!currentUserId && rawUser) {
    try {
      const parsed = JSON.parse(rawUser);
      currentUserId = parsed._id || parsed.id;
    } catch (e) {
      currentUserId = rawUser;
    }
  }

  // Bind real-time WebSocket listeners
  useFeedSocket(setPosts, setSelectedMedia);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const res = await fetchMyPostsAPI();
        if (res.data.success) {
          const sortedPosts = res.data.images.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPosts(sortedPosts);
        }
      } catch (err) {
        console.error("Error fetching your posts:", err);
        setError(err.response?.data?.message || "Failed to load your posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

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
      toast.success("Post link copied to clipboard & shared!");
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
      toast.success("Download started successfully!");
    } catch { window.open(url, "_blank"); }
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    try {
      const res = await deletePostAPI(postToDelete);
      if (res.data.success) {
        toast.success(res.data.message || "Post deleted successfully!");
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postToDelete));

        if (selectedMedia && selectedMedia.postId === postToDelete) {
          setSelectedMedia(null);
        }
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error(err.response?.data?.message || "Failed to delete post.");
    } finally {
      setPostToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950 w-full overflow-x-hidden">
        <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[92vh] bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950 w-full overflow-x-hidden flex items-center justify-center px-4">
        <div className="text-center py-12 px-6 text-red-400 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 max-w-md w-full shadow-2xl">
          <AlertTriangle className="w-10 h-10 mx-auto text-red-400 mb-2" />
          <p>{error}</p>
        </div>
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
              My Uploaded Posts
            </h1>
            <p className="text-purple-200/70 text-sm mt-1">
              Manage your published moments, monitor engagement, and control your content library.
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 max-w-lg mx-auto shadow-2xl p-6">
            <ImageIcon className="w-12 h-12 mx-auto text-purple-400/50 mb-3" />
            <p className="text-lg font-medium text-gray-200">No images available for this user.</p>
            <p className="text-xs text-gray-400 mt-1">Upload a post from the navigation menu to see it here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {posts.flatMap((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              return post.Img.map((media, mediaIndex) => (
                <PostCard
                  key={`${post._id}-${mediaIndex}`}
                  post={post}
                  media={media}
                  mediaIndex={mediaIndex}
                  currentUserId={currentUserId}
                  formattedDate={formattedDate}
                  onLike={handleLike}
                  onOpenModal={() => {
                    const isVideo = media.url.match(/\.(mp4|mov|webm|avi)$/i) || media.url.includes("video");
                    setSelectedMedia({
                      ...media,
                      postId: post._id,
                      userId: post.userId?._id || post.userId || currentUserId,
                      isVideo,
                      title: post.ImageName,
                      desc: post.ImageDesc,
                      userEmail: post.userId?.email || post.userEmail || "User",
                      date: formattedDate,
                      userProfilePic: post.userId?.profilepic || post.userProfilePic,
                      comments: post.comments || []
                    });
                  }}
                  onShare={(id) => handleShare(id, media.url)}
                  onDeleteClick={(id) => setPostToDelete(id)}
                />
              ));
            })}
          </div>
        )}

        {/* CONFIRMATION POPUP MODAL */}
        {postToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Post?</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setPostToDelete(null)}
                  className="bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeletePost}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* COMMENTS & MEDIA MODAL */}
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

export default MyPosts;