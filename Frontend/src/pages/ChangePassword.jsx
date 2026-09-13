import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { changePasswordAPI } from "@/services/api";

const ChangePassword = () => {

    const { email } = useParams();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const res = await changePasswordAPI(email, newPassword, confirmPassword);

            if (res.data.success) {
                toast.success(res.data.message || "Password updated successfully!");
                navigate("/login");
            }

        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex justify-center items-center min-h-[90vh] px-4 overflow-hidden bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950 pt-20">
            
            {/* Background Glowing Ambient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-4 relative z-10">

                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-[#59168B] shadow-sm mb-1">
                        <Lock className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Change Password
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-sm">
                        Please enter and confirm your new secure password
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-2">
                    <form onSubmit={submitHandler} id="change-password-form" className="space-y-4">

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B] pr-10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B] pr-10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                    </form>
                </CardContent>

                <CardFooter className="pt-2">
                    <Button
                        form="change-password-form"
                        type="submit"
                        disabled={loading}
                        style={{ backgroundColor: "#59168B" }}
                        className="w-full text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Please Wait...
                            </>
                        ) : (
                            "Change Password"
                        )}
                    </Button>
                </CardFooter>

            </Card>

        </div>
    );
};

export default ChangePassword;