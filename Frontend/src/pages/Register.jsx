import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react"
import { registerAPI } from "@/services/api";

const Register = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);

      const res = await registerAPI(formData);

      if (res.data.success) {
        navigate("/verify", {
          state: {
            email: formData.email,
          },
        });
        toast.success(res.data.message || "Account registered successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed.");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex justify-center items-center min-h-[92vh] px-4 overflow-hidden bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950 pt-20 pb-10">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-4 relative z-10">
        
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-[#59168B] shadow-sm mb-1">
            <UserPlus className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Create an Account
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm">
            Enter your details below to join SnapShare
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <form onSubmit={submitHandler} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="rounded-xl border-gray-300 focus:border-[#59168B] focus:ring-[#59168B]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
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

            <Button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#59168B" }}
              className="w-full mt-2 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Please Wait...
                </>
              ) : (
                "Send OTP For Sign Up"
              )}
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-gray-100 pt-4 mt-2">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
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
  )
}

export default Register;