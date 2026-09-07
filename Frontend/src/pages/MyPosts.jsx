import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Image as ImageIcon, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/images/myposts", {
          withCredentials: true,
        });

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

  // Delete Handler Function
  const handleDelete = async (postId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/images/deletepost/${postId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Post deleted successfully!");
        // Filter out the deleted post from the frontend state instantly
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        
        // Close modal if the currently viewed media is being deleted
        if (selectedMedia && selectedMedia.postId === postId) {
          setSelectedMedia(null);
        }
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error(err.response?.data?.message || "Failed to delete post.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 relative">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <ImageIcon className="text-purple-500" /> My Posts
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-gray-900/50 rounded-xl border border-gray-800 max-w-xl mx-auto">
          <p>No images available for this user</p>
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
                    {/* TOP: User Profile + Delete Button */}
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-gray-800/60">
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner flex-shrink-0">
                          {firstLetter}
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="text-sm font-semibold text-gray-200 truncate">{post.userEmail}</span>
                          <span className="text-xs text-gray-500">
                            {formattedDate}
                          </span>
                        </div>
                      </div>

                      {/* Delete Icon Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post._id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 rounded-full"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardHeader>

                    {/* CENTER: Clickable Media Container */}
                    <div 
                      onClick={() => setSelectedMedia({ ...media, postId: post._id, isVideo, title: post.ImageName, desc: post.ImageDesc, userEmail: post.userEmail, date: formattedDate })}
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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden max-w-2xl w-full relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMedia(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Media Content */}
            <div className="bg-black max-h-[60vh] flex items-center justify-center overflow-hidden">
              {selectedMedia.isVideo ? (
                <video 
                  src={selectedMedia.url} 
                  controls 
                  autoPlay 
                  playsInline 
                  className="w-full max-h-[60vh] object-contain" 
                />
              ) : (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.title} 
                  className="w-full max-h-[60vh] object-contain" 
                />
              )}
            </div>

            {/* Modal Footer Info */}
            <div className="p-4 space-y-2 bg-gray-900 flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
                  <span>{selectedMedia.userEmail}</span>
                  <span className="text-gray-500">• {selectedMedia.date}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{selectedMedia.title}</h2>
                <p className="text-sm text-gray-300">{selectedMedia.desc}</p>
              </div>

              {/* Delete Button inside Modal */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(selectedMedia.postId)}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;