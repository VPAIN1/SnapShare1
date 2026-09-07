import React from "react";
import { Link } from "react-router-dom";
import { Camera, Share2, Globe, MessageCircle, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <Camera className="w-6 h-6 text-purple-500" />
              <span>SnapShare</span>
            </div>
            <p className="text-sm text-gray-400">
              Your favorite destination to upload, share, and discover stunning high-quality photos with a global community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/home" className="hover:text-purple-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-purple-400 transition">Explore Feed</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-purple-400 transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-purple-400 transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Support & Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-purple-400 transition cursor-pointer">Help Center</span>
              </li>
              <li>
                <span className="hover:text-purple-400 transition cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-purple-400 transition cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-purple-400 transition cursor-pointer">Community Guidelines</span>
              </li>
            </ul>
          </div>

          {/* Socials / Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-base">Connect With Us</h3>
            <p className="text-sm text-gray-400 mb-4">
              Follow our channels for inspiration and updates.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 hover:text-white transition" title="Share">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 hover:text-white transition" title="Community">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-600 hover:text-white transition" title="Website">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SnapShare. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for creators.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;