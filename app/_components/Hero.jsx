import React from "react";
import Link from "next/link"; // Import Link for navigation

function Hero() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white relative flex-grow">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              Take Control of Your Finances.
              <span className="sm:block"> Build a Secure Future. </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
              Track, budget, and manage your finances effortlessly with a personal finance tracker for smarter financial decisions.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                className="block w-full rounded-sm border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:ring-3 focus:outline-hidden sm:w-auto"
                href="/sign-up"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Video */}
        <video
          autoPlay
          loop
          muted
          className="w-full h-auto object-cover"
          src="/money2.mp4" // Path to your video in the public folder
        />
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding Section */}
          <div>
            <h3 className="text-xl font-bold text-green-400">Finance Tracker</h3>
            <p className="mt-2 text-gray-400">
              Empowering you to take control of your financial future.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-green-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-gray-400 hover:text-green-400 transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-400 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact/Support Section */}
          <div>
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="mailto:support@financetracker.com" className="text-gray-400 hover:text-green-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-green-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Finance Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Hero;