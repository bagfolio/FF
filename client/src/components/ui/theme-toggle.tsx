import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "glass";
}

export function ThemeToggle({ className, variant = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  if (variant === "glass") {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "relative p-3 rounded-full transition-all duration-300",
          "glass-morph hover:glass-morph-dark",
          "group",
          className
        )}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="relative w-6 h-6">
          <Sun 
            className={cn(
              "absolute inset-0 transition-all duration-300",
              "text-amarelo-ouro drop-shadow-glow",
              theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
            )}
          />
          <Moon 
            className={cn(
              "absolute inset-0 transition-all duration-300",
              "text-blue-400 drop-shadow-glow",
              theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
            )}
          />
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amarelo-ouro/20 to-azul-celeste/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn("relative", className)}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun 
        className={cn(
          "absolute h-5 w-5 transition-all duration-300",
          theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        )}
      />
      <Moon 
        className={cn(
          "absolute h-5 w-5 transition-all duration-300",
          theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
        )}
      />
    </Button>
  );
}