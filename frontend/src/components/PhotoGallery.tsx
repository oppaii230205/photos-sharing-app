"use client";

import React, { useState, useEffect } from "react";
import PhotoCard from "./PhotoCard";
import { Button } from "antd";
import { Spin } from "antd";

const MOCK_PHOTOS = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    user: {
      name: "Sarah Jenkins",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      time: "2 HOURS AGO",
    },
    likes: 12,
    comments: [
      {
        id: "101",
        user: {
          name: "Marcus",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        },
        text: "Love the lighting in this shot! Did you use a filter?",
        time: "1h ago",
      },
      {
        id: "102",
        user: {
          name: "Elena",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
        },
        text: "Absolutely breathtaking scenery.",
        time: "45m ago",
      },
    ],
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a5d?w=800&q=80",
    user: {
      name: "Alex Rivera",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      time: "4 HOURS AGO",
    },
    likes: 34,
    comments: [
      {
        id: "201",
        user: {
          name: "Jordan",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        },
        text: "Nature is the best therapist. Beautiful catch.",
        time: "2h ago",
      },
      {
        id: "202",
        user: {
          name: "Sam",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
        },
        text: "The depth of green here is incredible.",
        time: "1h ago",
      },
    ],
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    user: {
      name: "David Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      time: "6 HOURS AGO",
    },
    likes: 8,
    comments: [
      {
        id: "301",
        user: {
          name: "Chloe",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe",
        },
        text: "The fog adds so much mood to this!",
        time: "3h ago",
      },
      {
        id: "302",
        user: {
          name: "Tom",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
        },
        text: "Perfect composition.",
        time: "2h ago",
      },
    ],
  },
];

export default function PhotoGallery() {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setPhotos(MOCK_PHOTOS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 w-full shadow-sm mt-2">
          {/* Using a simple placeholder for empty state */}
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-primary/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No photos yet</h3>
          <p className="text-gray-500 mt-2 text-center max-w-sm">
            Be the first to share a moment with the community. Upload your first
            photo above!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>

          <Button
            shape="round"
            size="large"
            className="mt-10 px-10 h-11 font-medium text-gray-700 hover:text-gray-900 border-gray-200 shadow-sm"
          >
            Load More
          </Button>
        </>
      )}
    </div>
  );
}
