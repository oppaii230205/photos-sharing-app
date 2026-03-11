"use client";

import React from "react";
import Link from "next/link";
import { BellOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-header px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <AppstoreOutlined className="text-xl" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            PhotoBoard
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-primary font-medium border-b-2 border-primary py-5"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 font-medium py-5 transition-colors"
          >
            Explore
          </Link>
          <Link
            href="#"
            className="text-gray-500 hover:text-gray-900 font-medium py-5 transition-colors"
          >
            Collections
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <button className="text-gray-400 hover:text-gray-700 transition">
            <Badge dot color="#6366f1" offset={[-2, 4]}>
              <BellOutlined className="text-xl" />
            </Badge>
          </button>
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            className="cursor-pointer border border-gray-200"
          />
        </div>
      </div>
    </header>
  );
}
