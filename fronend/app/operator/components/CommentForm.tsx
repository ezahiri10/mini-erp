import { useState } from "react";

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

export default function CommentForm({
  onSubmit,
  isLoading = false,
  placeholder = "Add a comment...",
}: CommentFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      await onSubmit(text);
      setText("");
    } catch (err: any) {
      setError(err.message || "Failed to add comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          disabled={isLoading}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {isLoading ? "Adding..." : "Add Comment"}
      </button>
    </form>
  );
}
