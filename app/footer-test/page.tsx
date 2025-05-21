"use client";

import { Footer } from "@/components/layout/Footer";

export default function FooterTestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="container mx-auto px-4 py-20 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Footer Component Test</h1>
        <p className="text-lg text-gray-300 mb-4">
          This page is testing the Footer component in isolation. The footer should be visible at the bottom of the page.
        </p>
        <p className="text-lg text-gray-300 mb-4">
          Try resizing the browser window to see how the footer responds to different screen sizes.
        </p>
        <p className="text-lg text-gray-300">
          The footer should show a responsive layout with different columns on different screen sizes.
        </p>
      </div>
      
      <Footer />
    </div>
  );
}
