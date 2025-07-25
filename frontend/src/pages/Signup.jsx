import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const slides = [
    {
      title: "Track your symptoms effortlessly",
      image: "https://via.placeholder.com/150?text=Track",
    },
    {
      title: "Personalize your care routine",
      image: "https://via.placeholder.com/150?text=Care",
    },
    {
      title: "Join the Materna community",
      image: "https://via.placeholder.com/150?text=Community",
    },
    {
      title: "Connect with other moms",
      image: "https://via.placeholder.com/150?text=Connect",
    },
    {
      title: "All your needs met pre and post birth",
      image: "https://via.placeholder.com/150?text=Support",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#f5f7fa] to-[#e3ebf4] font-sans">
      {/* Left: Sign Up Form */}
      <div className="relative w-full max-w-md bg-white shadow-xl rounded-3xl p-8 m-6 flex flex-col justify-center">
        <Link
          to="/"
          className="absolute top-4 left-4 text-sm text-[#a48bc3] font-semibold hover:text-[#9771bc]"
        >
          ← Back to Home
        </Link>
        <h2 className="text-2xl font-bold text-[#234451]">Are you ready for a journey?</h2>
        <p className="text-sm text-[#234451] mt-2">Create your account.</p>

        <button className="mt-6 border border-gray-300 rounded-lg py-2 flex items-center justify-center">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
          <span className="text-sm">Sign up with Google</span>
        </button>

        <div className="text-xs text-center text-gray-500 mt-4">or sign up with your email</div>

        <input
          className="mt-4 px-4 py-3 w-full border border-gray-200 rounded-xl placeholder-gray-400"
          placeholder="Nickname"
        />
        <input
          className="mt-3 px-4 py-3 w-full border border-gray-200 rounded-xl placeholder-gray-400"
          placeholder="Email"
        />
        <input
          type="password"
          className="mt-3 px-4 py-3 w-full border border-gray-200 rounded-xl placeholder-gray-400"
          placeholder="Password"
        />

        <button className="mt-6 bg-[#a48bc3] text-white py-3 rounded-xl font-semibold hover:bg-[#9771bc]">
          Sign up
        </button>

        <p className="mt-4 text-sm text-center text-[#234451]">
          Already have an account? <a href="/login" className="text-[#a48bc3] font-semibold">Log in</a>
        </p>
      </div>

      {/* Right: Carousel Section */}
      <div className="flex-1 bg-gradient-to-b from-[#d9e7f0] to-[#f5f7fa] px-10 py-8 overflow-hidden hidden md:flex flex-col items-center justify-center text-center transition-all duration-500">
        <img src={slides[currentSlide].image} alt="" className="w-40 h-40 object-cover rounded-2xl shadow-md mb-6" />
        <h2 className="text-2xl font-bold text-[#234451]">{slides[currentSlide].title}</h2>
      </div>
    </div>
  );
}