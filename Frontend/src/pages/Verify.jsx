import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const verifyOTP = async () => {
        try {
            setLoading(true);

            const res = await axios.post(
                `https://snapshare1.onrender.com/api/users/verify`,
                { email, otp }
            );

            if (res.data.success) {
                alert(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            alert(error.response?.data?.message || "OTP Verification Failed");
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        try {
            await axios.post(
                "https://snapshare1.onrender.com/api/users/reverify",
                { email }
            );

            alert("OTP sent successfully!");
        } catch (error) {
            alert(error.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

                <h2 className="text-3xl font-bold text-center text-blue-600">
                    Verify Email
                </h2>

                <p className="text-gray-500 text-center mt-3">
                    Enter the 6-digit OTP sent to
                </p>

                <p className="text-center font-medium text-gray-700 mt-1">
                    {email}
                </p>

                <Input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="mt-6 text-center text-xl tracking-[8px]"
                />

                <Button
                    onClick={verifyOTP}
                    disabled={loading}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </Button>

                <p className="text-center text-gray-500 mt-5">
                    Didn't receive the OTP?
                </p>

                <Button
                    variant="link"
                    onClick={resendOTP}
                    className="w-full"
                >
                    Resend OTP
                </Button>

            </div>

        </div>
    );
};

export default Verify;