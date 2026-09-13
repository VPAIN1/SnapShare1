import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Sparkles, Zap, ShieldCheck, Users } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className='bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white mt-16 min-h-[82vh] flex items-center py-16 relative overflow-hidden'>
            
            {/* Glowing Background Decorative Elements */}
            <div className='absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none'></div>
            <div className='absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none'></div>

            <div className='max-w-7xl mx-auto px-4 w-full relative z-10'>
                <div className='grid md:grid-cols-2 gap-12 items-center'>
                    
                    {/* Left Column: Text Content & Actions */}
                    <div className='text-center md:text-left space-y-6'>
                        
                        {/* Floating Pill Badge */}
                        <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-purple-200 text-xs font-medium backdrop-blur-md shadow-sm'>
                            <Sparkles className='w-3.5 h-3.5 text-yellow-400' />
                            <span>Powered by Live WebSockets & Cloud Storage</span>
                        </div>

                        <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight leading-tight'>
                            Share Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400'>Moments</span> With The World
                        </h1>

                        <p className='text-lg text-purple-200/90 leading-relaxed max-w-xl'>
                            Upload photos and videos, engage in real-time comment threads, and connect globally with creators on SnapShare.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center pt-2'>
                            <Button 
                                onClick={() => navigate("/publicPosts")}
                                className='bg-white text-purple-950 hover:bg-purple-50 w-full sm:w-auto font-bold px-8 py-3 rounded-xl shadow-xl shadow-purple-950/50 transition transform hover:-translate-y-0.5 cursor-pointer'
                            >
                                Upload Post
                            </Button>
                            <Button 
                                variant='outline' 
                                onClick={() => navigate("/feed")}
                                className='border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm w-full sm:w-auto font-semibold px-8 py-3 rounded-xl transition cursor-pointer'
                            >
                                Explore Feed
                            </Button>
                        </div>

                        {/* Quick Feature Metric Pills at the bottom of Hero */}
                        <div className='pt-6 grid grid-cols-3 gap-4 border-t border-white/10'>
                            <div className='flex items-center gap-2 text-xs text-purple-200'>
                                <Zap className='w-4 h-4 text-yellow-400 shrink-0' />
                                <span>Live WebSockets</span>
                            </div>
                            <div className='flex items-center gap-2 text-xs text-purple-200'>
                                <ShieldCheck className='w-4 h-4 text-emerald-400 shrink-0' />
                                <span>Secure JWT Auth</span>
                            </div>
                            <div className='flex items-center gap-2 text-xs text-purple-200'>
                                <Users className='w-4 h-4 text-pink-400 shrink-0' />
                                <span>Open Feed</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Platform Preview Image with Glow */}
                    <div className='flex justify-center relative'>
                        <div className='absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl transform rotate-3'></div>
                        <img 
                            src="/snap.png" 
                            alt="SnapShare Platform Preview" 
                            className='relative rounded-2xl shadow-2xl border border-white/15 object-cover max-h-[350px] md:max-h-[460px] w-full max-w-[500px] transform hover:scale-[1.01] transition duration-300'
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;