"use client";

import React, { useState } from "react";
import { Upload, message, Button } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Dragger } = Upload;

interface PhotoUploadProps {
  onUploadSuccess: () => void;
}

export default function PhotoUpload({ onUploadSuccess }: PhotoUploadProps) {
  const [loading, setLoading] = useState(false);

  const props: UploadProps = {
    name: "photo",
    multiple: false,
    showUploadList: false,
    customRequest: async ({ file, onSuccess }) => {
      setLoading(true);
      // Simulate API call for the mockup
      setTimeout(() => {
        setLoading(false);
        message.success(`${(file as File).name} file uploaded successfully.`);
        onSuccess?.("ok");
        onUploadSuccess();
      }, 1500);
    },
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/webp";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG/GIF files!");
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must smaller than 5MB!");
      }
      return isJpgOrPng && isLt5M;
    },
  };

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-100 flex justify-center">
      <div className="w-full max-w-2xl">
        <Dragger
          {...props}
          className="border-2 border-dashed rounded-2xl bg-[#F8FAFF] hover:bg-[#F2F6FF] transition-all duration-300 group overflow-hidden"
          style={{
            padding: "60px 20px",
            background: "#f8faff",
            borderColor: "rgba(99, 102, 241, 0.3)",
          }}
        >
          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="w-16 h-16 bg-indigo-100 text-primary rounded-full flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
              <CloudUploadOutlined />
            </div>
            <div className="text-center md:mt-2">
              <p className="text-xl font-semibold text-gray-800 mb-2">
                Drag your photo here or click to upload
              </p>
              <p className="text-sm text-gray-500 mb-6 font-medium">
                Support for High-Res JPG, PNG and GIF
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              className="bg-primary hover:bg-indigo-600 h-12 px-8 rounded-full shadow-md shadow-primary/30 font-semibold border-0 flex items-center justify-center"
              loading={loading}
            >
              <span className="text-xl mr-1 leading-none font-light">+</span>{" "}
              Upload Photo
            </Button>
          </div>
        </Dragger>
      </div>
    </div>
  );
}
