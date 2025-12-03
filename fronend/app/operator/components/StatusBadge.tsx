interface StatusBadgeProps {
  status: string;
  variant?: "lead" | "claim";
}

export default function StatusBadge({
  status,
  variant = "claim",
}: StatusBadgeProps) {
  const getStatusColor = () => {
    if (variant === "lead") {
      switch (status) {
        case "NEW":
          return "bg-blue-900 text-blue-300";
        case "CONTACTED":
          return "bg-purple-900 text-purple-300";
        case "CONVERTED":
          return "bg-green-900 text-green-300";
        case "LOST":
          return "bg-red-900 text-red-300";
        default:
          return "bg-gray-700 text-gray-300";
      }
    } else {
      switch (status) {
        case "SUBMITTED":
          return "bg-yellow-900 text-yellow-300";
        case "IN_REVIEW":
          return "bg-blue-900 text-blue-300";
        case "RESOLVED":
          return "bg-green-900 text-green-300";
        default:
          return "bg-gray-700 text-gray-300";
      }
    }
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
