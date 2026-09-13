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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

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

            const res = await axios.post(
                `http://localhost:5000/api/users/change-password/${email}`,
                {
                    newPassword,
                    confirmPassword,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);

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
        <div className="flex justify-center items-center min-h-screen">

            <Card className="w-full max-w-sm">

                <CardHeader>

                    <CardTitle>Change Password</CardTitle>

                    <CardDescription>
                        Enter your new password
                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <form onSubmit={submitHandler}>

                        <div className="flex flex-col gap-4">

                            {/* New Password */}

                            <div className="grid gap-2">

                                <Label htmlFor="newPassword">
                                    New Password
                                </Label>

                                <div className="relative">

                                    <Input
                                        id="newPassword"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        required
                                    />

                                    {showPassword ? (
                                        <EyeOff
                                            className="w-4 h-4 absolute right-5 top-3 cursor-pointer"
                                            onClick={() =>
                                                setShowPassword(false)
                                            }
                                        />
                                    ) : (
                                        <Eye
                                            className="w-4 h-4 absolute right-5 top-3 cursor-pointer"
                                            onClick={() =>
                                                setShowPassword(true)
                                            }
                                        />
                                    )}

                                </div>

                            </div>


                            {/* Confirm Password */}

                            <div className="grid gap-2">

                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>

                                <div className="relative">

                                    <Input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    {showConfirmPassword ? (
                                        <EyeOff
                                            className="w-4 h-4 absolute right-5 top-3 cursor-pointer"
                                            onClick={() =>
                                                setShowConfirmPassword(false)
                                            }
                                        />
                                    ) : (
                                        <Eye
                                            className="w-4 h-4 absolute right-5 top-3 cursor-pointer"
                                            onClick={() =>
                                                setShowConfirmPassword(true)
                                            }
                                        />
                                    )}

                                </div>

                            </div>

                        </div>

                    </form>

                </CardContent>


                <CardFooter>

                    <Button
                        onClick={submitHandler}
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
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