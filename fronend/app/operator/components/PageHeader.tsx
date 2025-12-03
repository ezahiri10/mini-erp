import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-2 text-white">{title}</h1>
      {description && <p className="text-gray-400">{description}</p>}
    </div>
  );
}
