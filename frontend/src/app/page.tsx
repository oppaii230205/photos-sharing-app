"use client";

import { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoGallery from "@/components/PhotoGallery";
import { FilterOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Button } from "antd";

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Uploads</h2>
            <p className="text-sm text-gray-500 mt-1">
              Discover what's happening in your community
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              icon={<FilterOutlined />}
              className="border-gray-200 text-gray-600 hover:text-primary rounded-full shadow-sm w-10 h-10 flex items-center justify-center flex-shrink-0"
            />
            <Button
              icon={<AppstoreOutlined />}
              className="border-gray-200 text-gray-600 hover:text-primary rounded-full shadow-sm w-10 h-10 flex items-center justify-center flex-shrink-0"
            />
          </div>
        </div>

        <PhotoGallery key={refreshKey} />
      </section>
    </div>
  );
}
