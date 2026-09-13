import axios from "axios";

const API_BASE = "https://snapshare1.onrender.com/api";

const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});


export const fetchAllPostsAPI = () => axios.get(`${API_BASE}/images/getallposts`, getAuthConfig());
export const fetchMyPostsAPI = () => axios.get(`${API_BASE}/images/myposts`, getAuthConfig());
export const deletePostAPI = (postId) => axios.delete(`${API_BASE}/images/deletepost/${postId}`, getAuthConfig());
export const likePostAPI = (postId) => axios.post(`${API_BASE}/images/${postId}/like`, {}, getAuthConfig());
export const addCommentAPI = (postId, text) => axios.post(`${API_BASE}/images/${postId}/comment`, { text }, getAuthConfig());
export const deleteCommentAPI = (postId, commentId) => axios.delete(`${API_BASE}/images/${postId}/comment/${commentId}`, getAuthConfig());
export const sharePostAPI = (postId) => axios.post(`${API_BASE}/images/${postId}/share`, {}, getAuthConfig());


export const forgetPasswordAPI = (email) => 
    axios.post(`${API_BASE}/users/forget-password`, { email });

export const addImageAPI = (formData) => 
    axios.post(`${API_BASE}/images/addimage`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

export const loginAPI = (formData) => 
    axios.post(`${API_BASE}/users/login`, formData);

export const changePasswordAPI = (email, newPassword, confirmPassword) => 
    axios.post(`${API_BASE}/users/change-password/${email}`, { newPassword, confirmPassword }, getAuthConfig());

export const getUserProfileAPI = () => 
    axios.get(`${API_BASE}/users/getuserprofile`, getAuthConfig());

export const getProfileViewerAPI = (email) => 
    axios.get(`${API_BASE}/users/profileviewer/${email}`, getAuthConfig());

export const registerAPI = (formData) => 
    axios.post(`${API_BASE}/users/register`, formData);

export const updateProfilePicAPI = (imageFormData) => 
    axios.patch(`${API_BASE}/users/update-profile-pic`, imageFormData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

export const updateProfileAPI = (formData) => 
    axios.patch(`${API_BASE}/users/update-profile`, formData,getAuthConfig());

export const getPostsViewerAPI = (email) => 
    axios.get(`${API_BASE}/users/postsviewer/${email}`, getAuthConfig());

export const verifyOtpAPI = (email, otp) => 
    axios.post(`${API_BASE}/users/verify`, { email, otp });

export const logoutAPI = () => 
    axios.post(`${API_BASE}/users/logout`, {}, getAuthConfig());

export const verifyOtpAPIF = (email, otp) => 
    axios.post(`${API_BASE}/users/verify-otp/${encodeURIComponent(email)}`, { otp });