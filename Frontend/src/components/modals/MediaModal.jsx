import React from "react";
import { X, Download } from "lucide-react";
import { CommentSection } from "../feed/CommentSection";

export const MediaModal = ({ selectedMedia, currentUserId, onClose, onAddComment, onDeleteComment, onDownload }) => {
    if (!selectedMedia) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-white/15 rounded-3xl overflow-hidden max-w-4xl w-full relative shadow-2xl flex flex-col md:flex-row max-h-[85vh]">
                
                {/* Media Preview Side */}
                <div className="bg-black flex-1 flex items-center justify-center relative min-h-[300px]">
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                        <button onClick={() => onDownload(selectedMedia.url, selectedMedia.title)} className="bg-black/60 hover:bg-black text-white p-2 rounded-full transition flex items-center gap-1.5 text-xs px-3.5 border border-white/20 cursor-pointer">
                            <Download className="w-4 h-4" /> Download
                        </button>
                        <button onClick={onClose} className="bg-black/60 hover:bg-black text-white p-2 rounded-full transition md:hidden border border-white/20 cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {selectedMedia.isVideo ? (
                        <video src={selectedMedia.url} controls playsInline className="w-full max-h-[70vh] object-contain" />
                    ) : (
                        <img src={selectedMedia.url} alt={selectedMedia.title} className="w-full max-h-[70vh] object-contain" />
                    )}
                </div>

                {/* Comments Side Pane */}
                <div className="w-full md:w-[380px] flex flex-col bg-gray-900 border-l border-gray-800">
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <div className="flex items-center gap-2.5 truncate">
                            <div className="w-9 h-9 rounded-full bg-purple-100 text-[#59168B] flex items-center justify-center text-xs font-bold overflow-hidden border border-purple-300 shrink-0">
                                {selectedMedia.userProfilePic ? (
                                    <img src={selectedMedia.userProfilePic} className="w-full h-full object-cover" />
                                ) : (
                                    selectedMedia?.userEmail?.charAt(0)?.toUpperCase() || "U"
                                )}
                            </div>
                            <span className="text-sm font-semibold text-gray-200 truncate">{selectedMedia?.userEmail || "User"}</span>
                        </div>
                        <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white cursor-pointer p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4 border-b border-gray-800 space-y-1 bg-gray-900/50">
                        <h2 className="text-base font-bold text-white truncate">{selectedMedia.title}</h2>
                        <p className="text-xs text-gray-400 leading-relaxed">{selectedMedia.desc}</p>
                    </div>

                    <CommentSection 
                        comments={selectedMedia.comments}
                        postId={selectedMedia.postId}
                        postUserId={selectedMedia.userId}
                        currentUserId={currentUserId}
                        onAddComment={onAddComment}
                        onDeleteComment={onDeleteComment}
                    />
                </div>

            </div>
        </div>
    );
};