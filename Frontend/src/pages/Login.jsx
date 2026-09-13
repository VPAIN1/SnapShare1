import React, { useState } from "react";
import { loginAPI } from "@/services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginAPI(formData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("auth-change"));
        toast.success(res.data.message || "Login successful!");
        navigate("/home");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
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
            <Sparkles className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm">
            Log in to your SnapShare account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <form onSubmit={submitHandler} className="space-y-4">

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Email Address</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 font-medium">Password</Label>
                <Link
                  to="/forget-password"
                  className="text-xs font-semibold text-[#59168B] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B] pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-gray-100 pt-4 mt-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#59168B] font-bold hover:underline"
            >
              Register here
            </Link>
          </p>
        </CardFooter>

      </Card>
    </div>
  );
};

export default Login;