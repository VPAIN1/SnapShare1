import React, { useState } from "react";
import axios from "axios";
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
import { Eye, EyeOff } from "lucide-react";

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

      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success(res.data.message);
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
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">

        <CardHeader>
          <CardTitle>Login</CardTitle>

          <CardDescription>
            Login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler}>

            <div className="flex flex-col gap-4">

              <div className="grid gap-2">
                <Label>Email</Label>

                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Password</Label>

                <div className="relative">

                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    required
                  />

                  {showPassword ? (
                    <EyeOff
                      className="absolute right-3 top-3 h-4 w-4 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="absolute right-3 top-3 h-4 w-4 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}

                </div>
              </div>

            </div>

            {/* Login button MUST be inside form */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">

          <Link
            to="/forget-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>

        </CardFooter>

      </Card>
    </div>
  );
};

export default Login;