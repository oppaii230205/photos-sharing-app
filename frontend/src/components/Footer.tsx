"use client";

import React from "react";
import { AppstoreOutlined } from "@ant-design/icons";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded flex items-center justify-center text-white">
            <AppstoreOutlined className="text-xs" />
          </div>
          <span className="font-bold text-gray-900">PhotoBoard</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-900 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            Help Center
          </a>
        </div>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} PhotoBoard Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
