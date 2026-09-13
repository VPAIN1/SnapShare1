import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export const PostActions = ({ post, currentUserId, onLike, onOpenModal, onShare }) => {
    const isLikedByMe = post.likes?.some((l) => (typeof l === "object" ? l._id || l.id : l)?.toString() === currentUserId?.toString());

    return (
        <div className="flex items-center justify-between pt-3 text-gray-600 text-sm">
            {/* Like Button & Count */}
            <button 
                onClick={() => onLike(post._id)} 
                className="flex items-center gap-1.5 transition hover:text-red-500 cursor-pointer"
            >
                <Heart className={`w-5 h-5 transition-transform active:scale-125 ${isLikedByMe ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                <span className="text-sm font-medium text-gray-700">{post.likes?.length || 0}</span>
            </button>

            {/* Comment Button & Count */}
            <button 
                onClick={onOpenModal} 
                className="flex items-center gap-1.5 transition hover:text-[#59168B] cursor-pointer"
            >
                <MessageCircle className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{post.comments?.length || 0}</span>
            </button>

            {/* Share Button & Count */}
            <button 
                onClick={() => onShare(post._id)} 
                className="flex items-center gap-1.5 transition hover:text-blue-500 cursor-pointer"
            >
                <Share2 className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{post.sharesCount || 0}</span>
            </button>
        </div>
    );
};