import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
import { Eye, EyeOff, Loader2 } from "lucide-react"
import axios from 'axios'


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
    const {name,value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name] : value,
    }))
  }


  const submitHandler = async (e) => {
    e.preventDefault()
    console.log(formData);
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/register", formData)
      if (res.data.success) {
        navigate("/verify", {
          state: {
            email: formData.email,
          },
        });
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create an account
          </CardDescription>
        </CardHeader>

        <CardContent>

          <form onSubmit={submitHandler}>

            <div className="flex flex-col gap-3">

              <div className="grid grid-cols-2 gap-4">

                <div className="grid gap-2">
                  <Label htmlFor="firstname">
                    FirstName
                  </Label>

                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lastname">
                    LastName
                  </Label>

                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>


              <div className="grid gap-2">

                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="grid gap-2">

                <Label htmlFor="password">
                  Password
                </Label>

                <div className="relative">

                  <Input
                    id="password"
                    name="password"
                    placeholder="create a strong password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  {showPassword ? (
                    <EyeOff
                      onClick={() => setShowPassword(false)}
                      className="w-4 h-4 absolute right-5 top-3 cursor-pointer"
                    />
                  ) : (
                    <Eye
                      onClick={() => setShowPassword(true)}
                      className="w-4 h-4 absolute right-5 top-3 cursor-pointer"
                    />
                  )}

                </div>

              </div>


              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
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

            </div>

          </form>

        </CardContent>


        <CardFooter className="flex-col gap-2">

          <p>
            Already have an account?{" "}

            <Link
              to="/login"
              className="hover:underline cursor-pointer"
            >
              Login
            </Link>

          </p>

        </CardFooter>
      </Card>
    </div>
  )
}

export default Register;