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
import { Loader2, KeyRound, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { forgetPasswordAPI, verifyOtpAPIF } from "@/services/api";
import { toast } from "sonner";

const ForgetPassword = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const sendOTP = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await forgetPasswordAPI(email);

            if (res.data.success) {
                toast.success(res.data.message || "OTP sent successfully!");
                setOtpSent(true);
            }

        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await verifyOtpAPIF(email, otp);

            if (res.data.success) {
                toast.success("OTP verified successfully");
                navigate(`/change-password/${encodeURIComponent(email)}`);
            }

        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error(
                error.response?.data?.message ||
                "Invalid OTP"
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
                        <KeyRound className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Forgot Password
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-sm">
                        {!otpSent 
                            ? "Enter your email to receive a verification OTP" 
                            : `Enter the 6-digit OTP sent to ${email}`}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-2">
                    {!otpSent ? (
                        /* ================= EMAIL FORM ================= */
                        <form onSubmit={sendOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                style={{ backgroundColor: "#59168B" }}
                                className="w-full mt-2 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    "Send OTP"
                                )}
                            </Button>
                        </form>
                    ) : (
                        /* ================= OTP FORM ================= */
                        <form onSubmit={verifyOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-gray-700 font-medium">
                                    Enter OTP
                                </Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="••••••"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                    className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B] text-center tracking-widest text-lg font-bold"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                style={{ backgroundColor: "#59168B" }}
                                className="w-full mt-2 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify OTP"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center border-t border-gray-100 pt-4 mt-2">
                    <p className="text-sm text-gray-600">
                        Remember your password?{" "}
                        <Link
                            to="/login"
                            className="text-[#59168B] font-bold hover:underline"
                        >
                            Login here
                        </Link>
                    </p>
                </CardFooter>

            </Card>
        </div>
    );
};

export default ForgetPassword;