"use client";

import { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoGallery from "@/components/PhotoGallery";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <section>
        <PhotoUpload onUploadSuccess={handleUploadSuccess} />
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Uploads</h2>
          <p className="text-sm text-gray-500 mt-1">
            Discover what&apos;s happening in your community
          </p>
        </div>

        <PhotoGallery key={refreshKey} />
      </section>
    </div>
  );
}
