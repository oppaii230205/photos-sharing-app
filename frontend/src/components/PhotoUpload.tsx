"use client";

// PhotoUpload component
// Handles photo file upload with optional caption using Ant Design Upload component
//
// TODO: Implement
// - Use antd Upload.Dragger for drag-and-drop upload
// - Add caption input field
// - Call photoApi.upload() on submit
// - Show upload progress
// - Trigger parent refresh on success

interface PhotoUploadProps {
  onUploadSuccess: () => void;
}

export default function PhotoUpload({ onUploadSuccess }: PhotoUploadProps) {
  return (
    <div>{/* TODO: Implement upload UI with antd Upload component */}</div>
  );
}
