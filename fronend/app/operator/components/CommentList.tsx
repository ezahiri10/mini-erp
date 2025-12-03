import { useState } from "react";

interface Comment {
  id: string;
  text: string;
  author: { name: string; email?: string };
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
  isLoading?: boolean;
}

export default function CommentList({
  comments,
  isLoading = false,
}: CommentListProps) {
  if (isLoading) {
    return <div className="text-gray-400">Loading comments...</div>;
  }

  if (comments.length === 0) {
    return <div className="text-gray-400 text-center py-8">No comments yet</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-gray-700 rounded-lg p-4 border border-gray-600"
        >
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-white">{comment.author.name}</p>
            <span className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-300">{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
