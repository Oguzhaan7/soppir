"use client";

import { CheckoutStep } from "@/types/checkout.types";
import { Icons } from "@/components/common/icons";
import { cn } from "@/lib/utils";

interface CheckoutStepperProps {
  steps: CheckoutStep[];
  currentStep: number;
}

export const CheckoutStepper = ({
  steps,
  currentStep,
}: CheckoutStepperProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center",
              index < steps.length - 1 && "flex-1"
            )}
          >
            <div className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  currentStep === step.id
                    ? "border-blue-600 bg-blue-600 text-white"
                    : step.completed
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                )}
              >
                {step.completed ? (
                  <Icons.check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-3">
                <p
                  className={cn(
                    "text-sm font-medium",
                    currentStep === step.id
                      ? "text-blue-600"
                      : step.completed
                      ? "text-green-600"
                      : "text-gray-500"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={cn(
                    "h-0.5 transition-colors",
                    step.completed ? "bg-green-600" : "bg-gray-300"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
