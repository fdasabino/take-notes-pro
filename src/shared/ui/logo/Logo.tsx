import React from "react";

interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: "default" | "icon-only";
}

const Logo: React.FC<LogoProps> = ({
  size = 48,
  showText = true,
  variant = "default",
}) => {
  const iconSize = variant === "icon-only" ? size : size * 0.8;

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0">
        {/* Background Circle with Gradient */}
        <defs>
          <linearGradient
            id="logoGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <stop
              offset="0%"
              stopColor="#6366f1"
            />
            <stop
              offset="100%"
              stopColor="#8b5cf6"
            />
          </linearGradient>
          <linearGradient
            id="penGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <stop
              offset="0%"
              stopColor="#fbbf24"
            />
            <stop
              offset="100%"
              stopColor="#f59e0b"
            />
          </linearGradient>
        </defs>

        {/* Main Circle Background */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#logoGradient)"
        />

        {/* Paper/Note Element */}
        <rect
          x="28"
          y="25"
          width="35"
          height="45"
          rx="3"
          fill="white"
          opacity="0.95"
        />

        {/* Lines on the paper */}
        <line
          x1="33"
          y1="35"
          x2="58"
          y2="35"
          stroke="#6366f1"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        <line
          x1="33"
          y1="42"
          x2="58"
          y2="42"
          stroke="#6366f1"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        <line
          x1="33"
          y1="49"
          x2="50"
          y2="49"
          stroke="#6366f1"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Pen Element - Dynamic and inspiring */}
        <g transform="rotate(-45 50 50)">
          {/* Pen body */}
          <rect
            x="52"
            y="30"
            width="8"
            height="35"
            rx="1.5"
            fill="url(#penGradient)"
          />

          {/* Pen clip */}
          <rect
            x="54"
            y="32"
            width="4"
            height="8"
            rx="1"
            fill="white"
            opacity="0.4"
          />

          {/* Pen tip */}
          <path
            d="M 52 65 L 56 72 L 60 65 Z"
            fill="#374151"
          />
          <path
            d="M 54 65 L 56 68 L 58 65 Z"
            fill="#1f2937"
          />

          {/* Pen cap top */}
          <circle
            cx="56"
            cy="32"
            r="3"
            fill="#fbbf24"
          />
        </g>

        {/* Sparkle/Inspiration elements */}
        <circle
          cx="72"
          cy="30"
          r="2"
          fill="white"
          opacity="0.8"
        />
        <circle
          cx="78"
          cy="40"
          r="1.5"
          fill="white"
          opacity="0.6"
        />
        <circle
          cx="25"
          cy="35"
          r="1.5"
          fill="white"
          opacity="0.7"
        />

        {/* Star sparkle */}
        <path
          d="M 22 72 L 23 74 L 25 75 L 23 76 L 22 78 L 21 76 L 19 75 L 21 74 Z"
          fill="white"
          opacity="0.8"
        />
      </svg>

      {/* Logo Text */}
      {showText && variant === "default" && (
        <div className="flex flex-col text-foreground">
          <span
            className="tracking-tight text-foreground"
            style={{ fontSize: size * 0.4 }}>
            Take Notes
          </span>
          <span
            className="tracking-wide font-bold text-foreground"
            style={{
              fontSize: size * 0.25,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            PRO
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
