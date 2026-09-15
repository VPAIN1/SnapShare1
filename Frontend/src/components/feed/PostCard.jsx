// my post only


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { PostActions } from "../modals/PostActions";

export const PostCard = ({ post, media, mediaIndex, currentUserId, formattedDate, onLike, onOpenModal, onShare, onDeleteClick }) => {
    const isVideo = media.url.match(/\.(mp4|mov|webm|avi)$/i) || media.url.includes("video");
    
    // Safely extract email and fallback avatar details from the populated userId object
    const userEmail = post.userId?.email || post.userEmail || "user@example.com";
    const userProfilePic = post.userId?.profilepic || post.userProfilePic;
    const username = userEmail.split("@")[0];
    const firstLetter = username.charAt(0).toUpperCase();

    return (
        <Card className="bg-white/95 backdrop-blur-xl text-gray-900 border border-white/20 shadow-2xl overflow-hidden rounded-3xl flex flex-col justify-between w-full hover:border-purple-300 transition duration-300">
            <div>
                {/* TOP: User Profile + Delete Button */}
                <CardHeader className="flex flex-row items-center justify-between py-3.5 px-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 truncate">
                        <div className="w-11 h-11 rounded-full bg-purple-100 text-[#59168B] flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 overflow-hidden border border-purple-200">
                            {userProfilePic ? <img src={userProfilePic} className="w-full h-full object-cover" /> : firstLetter}
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-sm font-semibold text-gray-900 truncate">{userEmail}</span>
                            <span className="text-xs text-gray-400">{formattedDate}</span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteClick(post._id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 w-9 rounded-xl cursor-pointer transition"
                        title="Delete Post"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </CardHeader>

                {/* CENTER: Clickable Media Container */}
                <div
                    onClick={onOpenModal}
                    className="bg-black w-full flex items-center justify-center h-[320px] overflow-hidden cursor-pointer group relative"
                >
                    {isVideo ? (
                        <video src={media.url} muted playsInline controls className="w-full h-full object-contain pointer-events-auto" />
                    ) : (
                        <img src={media.url} alt={post.ImageName} className="w-full h-full object-contain transition duration-300 group-hover:scale-105" />
                    )}
                </div>
            </div>

            {/* BOTTOM: Title & Actions */}
            <CardContent className="py-4 px-4 space-y-3">
                <div>
                    <h2 className="font-bold text-base text-gray-900 truncate">{post.ImageName}</h2>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{post.ImageDesc}</p>
                </div>

                <div className="pt-2 border-t border-gray-100">
                    <PostActions 
                        post={post} 
                        currentUserId={currentUserId} 
                        onLike={onLike} 
                        onOpenModal={onOpenModal} 
                        onShare={onShare} 
                    />
                </div>
            </CardContent>
        </Card>
    );
};