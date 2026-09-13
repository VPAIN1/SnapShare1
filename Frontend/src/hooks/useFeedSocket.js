import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export const useFeedSocket = (setPosts, setSelectedMedia) => {
    useEffect(() => {
        socket.on("post-liked", ({ postId, likes }) => {
            setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, likes } : p)));
        });

        socket.on("comment-added", ({ postId, comments }) => {
            setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, comments } : p)));
            setSelectedMedia((prev) => (prev && prev.postId === postId ? { ...prev, comments } : prev));
        });

        socket.on("comment-deleted", ({ postId, comments }) => {
            setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, comments } : p)));
            setSelectedMedia((prev) => (prev && prev.postId === postId ? { ...prev, comments } : prev));
        });

        socket.on("post-shared", ({ postId, sharesCount }) => {
            setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, sharesCount } : p)));
        });

        return () => {
            socket.off("post-liked");
            socket.off("comment-added");
            socket.off("comment-deleted");
            socket.off("post-shared");
        };
    }, [setPosts, setSelectedMedia]);
};