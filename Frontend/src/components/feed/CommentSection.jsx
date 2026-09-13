import React, { useState } from "react";
import { Send, Trash2 } from "lucide-react";

export const CommentSection = ({ comments, postId, postUserId, currentUserId, onAddComment, onDeleteComment }) => {
    const [commentText, setCommentText] = useState("");

    const handleSubmit = () => {
        if (!commentText.trim()) return;
        onAddComment(postId, commentText);
        setCommentText("");
    };

    return (
        <div className="flex flex-col h-full bg-gray-900">
            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[260px]">
                {comments?.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-6">No comments yet.</p>
                ) : (
                    comments?.map((c, idx) => {
                        const myId = currentUserId ? currentUserId.toString() : "";
                        
                        // Handle case where c.userId might be an object (populated) or a string ID
                        const authorIdObj = c.userId;
                        const commentAuthorId = typeof authorIdObj === "object" && authorIdObj !== null 
                            ? (authorIdObj._id || authorIdObj.id)?.toString() 
                            : authorIdObj?.toString() || "";
                            
                        const postOwnerId = postUserId ? postUserId.toString() : "";

                        const canDelete = (myId && commentAuthorId && myId === commentAuthorId) || 
                                          (myId && postOwnerId && myId === postOwnerId);

                        // Safely extract populated user info for the comment author
                        const userEmail = (typeof authorIdObj === "object" && authorIdObj?.email) || c.userEmail || "user@example.com";
                        const userProfilePic = (typeof authorIdObj === "object" && authorIdObj?.profilepic) || c.userProfilePic;
                        const firstLetter = userEmail.charAt(0).toUpperCase();

                        return (
                            <div key={idx} className="flex items-start justify-between gap-2 text-xs group">
                                <div className="flex items-start gap-2 flex-1">
                                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
                                        {userProfilePic ? <img src={userProfilePic} className="w-full h-full object-cover" /> : firstLetter}
                                    </div>
                                    <div className="bg-gray-800/60 p-2 rounded-lg flex-1">
                                        <span className="font-semibold text-purple-400 block">{userEmail}</span>
                                        <p className="text-gray-200 mt-0.5">{c.text}</p>
                                    </div>
                                </div>
                                {canDelete && (
                                    <button onClick={() => onDeleteComment(postId, c._id)} className="text-gray-500 hover:text-red-400 p-1 transition">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-800 flex items-center gap-2 bg-gray-900">
                <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition">
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};