import React from "react";
import { Share2, ShieldCheck, Code2, Globe, Heart, Users, Sparkles, MessageCircle, ThumbsUp, UserCircle, Rocket, Zap, BellRing } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div className="max-w-5xl mx-auto py-12 px-4 space-y-12 pt-22">
            
            {/* HERO SECTION */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center p-3 bg-purple-100 border border-purple-200 rounded-2xl text-purple-600 mb-2 shadow-sm">
                    <Globe className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gray-900">
                    Welcome to <span className="text-purple-600">SnapShare</span>
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                    SnapShare is a modern, high-performance <strong>open-source social media platform</strong> built to share moments, connect globally, and interact seamlessly in real time.
                </p>
                <div className="pt-3 flex justify-center gap-4">
                    <Link
                        to="/feed"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2.5 rounded-xl transition shadow-lg shadow-purple-200"
                    >
                        Explore Feed
                    </Link>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl transition shadow-sm"
                    >
                        GitHub Repository
                    </a>
                </div>
            </div>

            {/* CORE FEATURES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <Card className="bg-white border-gray-200 shadow-xl shadow-gray-100 rounded-2xl p-2 flex flex-col justify-between hover:border-purple-200 transition">
                    <CardHeader className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Real-Time WebSockets</h2>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600">
                        Powered by Socket.io for instantaneous updates on likes, comment threads, and shares across all connected clients without manual refreshing.
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-xl shadow-gray-100 rounded-2xl p-2 flex flex-col justify-between hover:border-purple-200 transition">
                    <CardHeader className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Secure Authentication</h2>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600">
                        Protected with JSON Web Tokens (JWT), password recovery flows, OTP account verification, and secure centralized API routing.
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-xl shadow-gray-100 rounded-2xl p-2 flex flex-col justify-between hover:border-purple-200 transition">
                    <CardHeader className="space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                            <Code2 className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Modular Tech Stack</h2>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600">
                        Built using React, Vite, Tailwind CSS, Node.js, Express, MongoDB Mongoose, and cloud media handling for rapid performance.
                    </CardContent>
                </Card>

            </div>

            {/* LIVE PLATFORM CAPABILITIES */}
            <div className="bg-white border border-purple-100 shadow-xl shadow-purple-50/50 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-100 rounded-xl text-purple-600">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Active Platform Capabilities</h2>
                        <p className="text-sm text-gray-500">Fully integrated core features currently running on SnapShare</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center gap-2 text-purple-600 font-semibold text-base">
                            <ThumbsUp className="w-4 h-4" /> Live Likes & Share Tracking
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Users can instantly like, unlike, and track media share metrics updated dynamically across the global community feed.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center gap-2 text-purple-600 font-semibold text-base">
                            <MessageCircle className="w-4 h-4" /> Interactive Comment Threads
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Real-time discussion panels and modal views allowing creators and viewers to post and delete comments instantly.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center gap-2 text-purple-600 font-semibold text-base">
                            <UserCircle className="w-4 h-4" /> Creator Profiles & Management
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Customizable profile avatars, password management, profile viewer pages, and dedicated dashboards to manage personal posts.
                        </p>
                    </div>
                </div>
            </div>

            {/* MISSION SECTION */}
            <div className="bg-gradient-to-br from-purple-50/60 to-white border border-purple-100 rounded-2xl p-8 space-y-4 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="text-purple-600 w-6 h-6" /> Our Vision & Mission
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    SnapShare is designed to be an accessible, transparent, and completely open-source social ecosystem. Whether you want to share media with the public or inspect the service-oriented full-stack architecture to understand real-time state synchronization, SnapShare serves as a dynamic space for creators and developers.
                </p>
                <div className="pt-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
                    <span>© 2026 SnapShare Open Source Platform</span>
                    <span className="flex items-center gap-1 text-gray-600">
                        Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the community
                    </span>
                </div>
            </div>

        </div>
    );
};

export default About;