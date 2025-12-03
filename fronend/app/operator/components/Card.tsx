interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  borderColor?: string;
}

export default function Card({
  title,
  value,
  icon,
  borderColor = "border-blue-400",
}: CardProps) {
  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
        </div>
        {icon && <div className="text-3xl opacity-50">{icon}</div>}
      </div>
    </div>
  );
}
