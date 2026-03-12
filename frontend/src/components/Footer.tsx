"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-5 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <span className="text-[13px] font-medium text-gray-400">PhotoBoard</span>
        <span className="text-[13px] text-gray-400">
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
