"use client";

import { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoGallery from "@/components/PhotoGallery";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-10">
      <section>
        <PhotoUpload onUploadSuccess={() => setRefreshKey((k) => k + 1)} />
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-[17px] font-semibold text-gray-900">Photos</h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Shared by the community
          </p>
        </div>
        <PhotoGallery key={refreshKey} />
      </section>
    </div>
  );
}
