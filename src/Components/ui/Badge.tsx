// Badge.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-extrabold",
  {
    variants: {
      variant: {
        default: "bg-[#31c53b25] text-[#31c53b]",
        red: "bg-[#ff474725] text-[#ff4747]",
        green: "bg-[#31c53b25] text-[#31c53b]",
        yellow: "bg-[#ffb82725] text-[#ffb827]",
        blue: "bg-[#0790e825] text-[#0790e8]",
        purple: "bg-[#a855f725] text-[#a855f7]",
        gray: "bg-[#71717a25] text-[#71717a]",
        primary: "bg-primary/20 text-primary",
        secondary: "bg-secondary/20 text-secondary",
        destructive: "bg-destructive/20 text-destructive",
        outline: "border border-input",
      },
      size: {
        xs: "h-4 px-1 text-[10px]",
        sm: "h-6 px-2 text-xs",
        md: "h-7 px-2.5 text-sm",
        lg: "h-8 px-3 text-base",
      },
      showDot: {
        true: "has-dot",
        false: "",
      },
      dotSize: {
        xs: "[--dot-size:0.25rem]", // 6px
        sm: "[--dot-size:0.375rem]", // 6px
        md: "[--dot-size:0.5rem]", // 8px
        lg: "[--dot-size:0.625rem]", // 10px
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      showDot: true,
      dotSize: "md",
    },
    compoundVariants: [
      {
        showDot: true,
        className: "pl-2",
      },
    ],
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { className, variant, size, showDot, dotSize, icon, children, ...props },
    ref
  ) => {
    // Get the color from the variant for the dot
    let dotColor = "";
    switch (variant) {
      case "default":
      case "green":
        dotColor = "#31c53b";
        break;
      case "red":
        dotColor = "#ff4747";
        break;
      case "yellow":
        dotColor = "#ffb827";
        break;
      case "blue":
        dotColor = "#0790e8";
        break;
      case "purple":
        dotColor = "#a855f7";
        break;
      case "gray":
        dotColor = "#71717a";
        break;
      case "primary":
        dotColor = "var(--primary)";
        break;
      case "secondary":
        dotColor = "var(--secondary)";
        break;
      case "destructive":
        dotColor = "var(--destructive)";
        break;
      case "outline":
        dotColor = "currentColor";
        break;
      default:
        dotColor = "#31c53b";
    }

    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, showDot, dotSize }),
          className
        )}
        {...props}
      >
        {showDot && (
          <div
            className="rounded-full aspect-square flex-shrink-0"
            style={{
              backgroundColor: dotColor,
              width: "var(--dot-size)",
              height: "var(--dot-size)",
            }}
          />
        )}
        {icon && !showDot && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
