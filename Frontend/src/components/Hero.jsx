import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className='bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white mt-16 min-h-[75vh] flex items-center py-12'>
            <div className='max-w-7xl mx-auto px-4 w-full'>
                <div className='grid md:grid-cols-2 gap-8 items-center'>
                    
                    <div className='text-center md:text-left'>
                        <h1 className='text-4xl md:text-6xl font-bold mb-4'>
                            Share Your Moments With The World
                        </h1>
                        <p className='text-lg md:text-xl mb-6 text-purple-100'>
                            Upload, store, and discover stunning photos instantly. Join a vibrant community of creators and capture your best memories.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center'>
                            <Button 
                                onClick={() => navigate("/publicPosts")}
                                className='bg-white text-purple-600 hover:bg-gray-100 w-full sm:w-auto font-semibold cursor-pointer'
                            >
                                Upload Image
                            </Button>
                            <Button 
                                variant='outline' 
                                onClick={() => navigate("/feed")}
                                className='border-white text-white hover:bg-white hover:text-purple-600 bg-transparent w-full sm:w-auto cursor-pointer'
                            >
                                Explore Feed
                            </Button>
                        </div>
                    </div>

                    <div className='flex justify-center mt-8 md:mt-0'>
                        <img 
                            src="/snap.png" 
                            alt="SnapShare Platform" 
                            className='rounded-xl shadow-2xl object-cover max-h-[300px] md:max-h-[450px] w-full max-w-[500px]'
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;