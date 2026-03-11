"use client";

// TODO: Implement photo detail page
// - Fetch single photo by ID with comments
// - Display full-size photo
// - Show CommentSection component
// - Handle loading and error states

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1>Photo Detail {id}</h1>
      {/* TODO: Add photo display and CommentSection */}
    </div>
  );
}
