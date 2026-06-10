import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  showText?: boolean;
}

export function StarFormLogo({ size = 32, showText = false, className, ...props }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className || ''}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id="starform-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
          <filter id="starform-logo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect
          x="4.5"
          y="10.5"
          width="16"
          height="18"
          rx="3.5"
          className="fill-muted/20 stroke-border/40"
          strokeWidth="1.2"
          transform="rotate(-6 12.5 19.5)"
        />

        <rect
          x="7.5"
          y="7.5"
          width="17"
          height="20"
          rx="4"
          className="fill-background stroke-primary/30 dark:stroke-border/80"
          strokeWidth="1.5"
        />

        <line
          x1="11.5"
          y1="12.5"
          x2="20.5"
          y2="12.5"
          className="stroke-muted-foreground/30"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="11.5"
          y1="16.5"
          x2="18.5"
          y2="16.5"
          className="stroke-muted-foreground/30"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="11.5"
          y1="20.5"
          x2="15.5"
          y2="20.5"
          className="stroke-muted-foreground/30"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <path
          d="M24.5 2C24.5 5.5 25.5 6.5 29 6.5C25.5 6.5 24.5 7.5 24.5 11C24.5 7.5 23.5 6.5 20 6.5C23.5 6.5 24.5 5.5 24.5 2Z"
          fill="url(#starform-logo-grad)"
          filter="url(#starform-logo-glow)"
        />

        <path
          d="M9 3C9 4.2 9.3 4.5 10.5 4.5C9.3 4.5 9 4.8 9 6C9 4.8 8.7 4.5 7.5 4.5C8.7 4.5 9 4.2 9 3Z"
          className="fill-primary/60 dark:fill-primary/80"
        />
      </svg>
      {showText && (
        <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Star<span className="text-primary">Form</span>
        </span>
      )}
    </div>
  );
}
