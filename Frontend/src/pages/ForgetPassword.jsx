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
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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

            const res = await axios.post(
                "http://localhost:5000/api/users/forget-password",
                {
                    email
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);

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

            const res = await axios.post(
                `http://localhost:5000/api/users/verify-otp/${encodeURIComponent(email)}`,
                {
                    otp: otp
                }
            );

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
        <div className="flex justify-center items-center min-h-screen">

            <Card className="w-full max-w-sm">

                <CardHeader>

                    <CardTitle>
                        Forgot Password
                    </CardTitle>

                    <CardDescription>
                        Enter your email to reset your password
                    </CardDescription>

                </CardHeader>


                <CardContent>

                    {!otpSent ? (

                        /* ================= EMAIL ================= */

                        <form onSubmit={sendOTP}>

                            <div className="grid gap-4">

                                <div className="grid gap-2">

                                    <Label htmlFor="email">
                                        Email
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />

                                </div>

                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
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

                        /* ================= OTP ================= */

                        <form onSubmit={verifyOTP}>

                            <div className="grid gap-4">

                                <div className="grid gap-2">

                                    <Label htmlFor="otp">
                                        Enter OTP
                                    </Label>

                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6 digit OTP"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(e.target.value)
                                        }
                                        maxLength={6}
                                        required
                                    />

                                </div>

                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
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


                <CardFooter className="flex justify-center">

                    <p className="text-sm">

                        Remember your password?{" "}

                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login
                        </Link>

                    </p>

                </CardFooter>

            </Card>

        </div>
    );
};

export default ForgetPassword;