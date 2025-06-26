import React from "react";
import Link from "next/link"; // Assuming you're using Next.js
import Footer from "_/components/Footer"; // Adjust path as needed

function Footer() {
  return (
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
        <p>&copy; {new Date().getFullYear()} Finance Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;