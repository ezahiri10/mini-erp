interface ClaimProgressProps {
  status: "SUBMITTED" | "IN_REVIEW" | "RESOLVED";
}

export default function ClaimProgress({ status }: ClaimProgressProps) {
  const steps = ["SUBMITTED", "IN_REVIEW", "RESOLVED"];
  const currentStep = steps.indexOf(status);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-white mb-4">Claim Progress</h3>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                index <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs text-center ${
                index <= currentStep ? "text-blue-400" : "text-gray-400"
              }`}
            >
              {step.replace("_", " ")}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mt-4 ${
                  index < currentStep ? "bg-blue-600" : "bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
