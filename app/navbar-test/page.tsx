"use client";

import { Navbar } from "@/components/layout/Navbar";

export default function NavbarTestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Navbar Component Test</h1>
        <p className="text-lg text-gray-300 mb-4">
          This page is testing the Navbar component in isolation. The navbar should be visible at the top of the page.
        </p>
        <p className="text-lg text-gray-300 mb-4">
          Try resizing the browser window to see how the navbar responds to different screen sizes.
        </p>
        <p className="text-lg text-gray-300">
          The navbar should show a mobile menu on small screens and a desktop menu on larger screens.
        </p>
      </div>
    </div>
  );
}
