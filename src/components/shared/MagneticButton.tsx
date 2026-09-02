// src/components/shared/MagneticButton.tsx
"use client";

import { forwardRef, useImperativeHandle, useRef, type ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const MagneticButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", type = "button", ...rest }, forwardedRef) => {
    const ref = useRef<HTMLButtonElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current as HTMLButtonElement);

    return (
      <button
        ref={ref}
        type={type}
        // Button apni jagah bilkul static rahega
        className={`group relative isolate overflow-hidden select-none cursor-pointer ${className}`}
        {...rest}
      >
        {/* Charismatic Red Splash: Darmayan se screen ki tarah khulne wali smooth animation */}
        <span
          aria-hidden
          className="absolute inset-0 z-0 bg-[#A31D1D] origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu"
        />

        {/* Dynamic Text: Base color parent se lega (black ya white), aur hover par guaranteed white ho jayega */}
        <span className="relative z-10 flex items-center justify-center gap-2.5 font-bold transition-colors duration-300 group-hover:text-white">
          {children}
        </span>
      </button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;