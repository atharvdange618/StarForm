'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { label: 'Details', description: 'Title & slug' },
  { label: 'Fields', description: 'Add & configure' },
  { label: 'Configure', description: 'Theme & options' },
  { label: 'Preview', description: 'Review & publish' },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isClickable = i <= currentStep && onStepClick;

        return (
          <div key={step.label} className="flex items-center">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => onStepClick?.(i)}
              className={cn(
                'flex items-center gap-2 font-body text-sm transition-colors',
                isCurrent && 'font-medium text-foreground',
                isCompleted && 'text-primary',
                !isCurrent && !isCompleted && 'text-muted-foreground',
                isClickable && 'cursor-pointer hover:text-foreground',
                !isClickable && 'cursor-default',
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isCurrent && 'bg-primary text-primary-foreground',
                  isCompleted && 'bg-primary/20 text-primary',
                  !isCurrent && !isCompleted && 'bg-muted text-muted-foreground',
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {i < steps.length - 1 ? (
              <div
                className={cn(
                  'mx-3 h-px w-8 sm:w-16 transition-colors',
                  i < currentStep ? 'bg-primary/40' : 'bg-border',
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
