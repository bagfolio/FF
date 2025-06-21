import React from 'react';

interface ProgressJourneyProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressJourney({ currentStep, totalSteps }: ProgressJourneyProps) {
  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full ${
            index < currentStep ? 'bg-green-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}