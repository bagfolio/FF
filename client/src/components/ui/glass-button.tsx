import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "glass-morph text-foreground hover:scale-105",
        green:
          "glass-morph-green text-verde-brasil hover:scale-105 hover:shadow-verde-brasil/30",
        yellow:
          "glass-morph-yellow text-amarelo-ouro hover:scale-105 hover:shadow-amarelo-ouro/30",
        blue:
          "glass-morph-blue text-azul-celeste hover:scale-105 hover:shadow-azul-celeste/30",
        dark:
          "glass-morph-dark text-white hover:scale-105",
        tint:
          "glass-morph-tint text-foreground hover:scale-105",
        ghost:
          "hover:bg-white/5 hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      glow: {
        true: "",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: false,
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, glow, ...props }, ref) => {
    return (
      <button
        className={cn(
          glassButtonVariants({ variant, size }),
          glow && variant === "green" && "shadow-[0_0_20px_rgba(0,156,59,0.3)]",
          glow && variant === "yellow" && "shadow-[0_0_20px_rgba(255,223,0,0.3)]",
          glow && variant === "blue" && "shadow-[0_0_20px_rgba(0,39,118,0.3)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };