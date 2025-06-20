import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassModal, GlassModalContent, GlassModalDescription, GlassModalHeader, GlassModalTitle, GlassModalTrigger } from "@/components/ui/glass-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Trophy, Star, Heart, Flame, Target } from "lucide-react";

export default function StyleGuide() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-bebas text-6xl text-foreground">
            Revela Style Guide
          </h1>
          <ThemeToggle />
        </div>
        <p className="text-xl text-muted-foreground">
          Complete theme reference with glassmorphic components and utilities
        </p>
      </div>

      {/* Color Palette */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="font-bebas text-4xl mb-6">Brazilian Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-verde-brasil shadow-lg"></div>
            <p className="text-sm font-medium">Verde Brasil</p>
            <p className="text-xs text-muted-foreground">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-amarelo-ouro shadow-lg"></div>
            <p className="text-sm font-medium">Amarelo Ouro</p>
            <p className="text-xs text-muted-foreground">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-azul-celeste shadow-lg"></div>
            <p className="text-sm font-medium">Azul Celeste</p>
            <p className="text-xs text-muted-foreground">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-verde-sucesso shadow-lg"></div>
            <p className="text-sm font-medium">Verde Sucesso</p>
            <p className="text-xs text-muted-foreground">Success</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-vermelho-alerta shadow-lg"></div>
            <p className="text-sm font-medium">Vermelho Alerta</p>
            <p className="text-xs text-muted-foreground">Error</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-laranja-destaque shadow-lg"></div>
            <p className="text-sm font-medium">Laranja Destaque</p>
            <p className="text-xs text-muted-foreground">Warning</p>
          </div>
        </div>
      </section>

      {/* Glassmorphic Cards */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="font-bebas text-4xl mb-6">Glassmorphic Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Default Glass</GlassCardTitle>
              <GlassCardDescription>Standard glassmorphic effect</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm">This card uses the default glass morphism style with subtle transparency and blur.</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard variant="dark">
            <GlassCardHeader>
              <GlassCardTitle className="text-white">Dark Glass</GlassCardTitle>
              <GlassCardDescription className="text-gray-300">Dark variant for contrast</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm text-gray-300">Perfect for creating depth on light backgrounds.</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard variant="green">
            <GlassCardHeader>
              <GlassCardTitle className="text-verde-brasil">Verde Brasil</GlassCardTitle>
              <GlassCardDescription>Brazilian green tinted glass</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm">Represents growth and Brazilian identity.</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard variant="yellow">
            <GlassCardHeader>
              <GlassCardTitle className="text-amarelo-ouro">Amarelo Ouro</GlassCardTitle>
              <GlassCardDescription>Golden yellow glass effect</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm">Symbolizes achievement and excellence.</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard variant="blue">
            <GlassCardHeader>
              <GlassCardTitle className="text-azul-celeste">Azul Celeste</GlassCardTitle>
              <GlassCardDescription>Sky blue glass variant</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm">Represents trust and reliability.</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard variant="tint">
            <GlassCardHeader>
              <GlassCardTitle className="gradient-text">Gradient Tint</GlassCardTitle>
              <GlassCardDescription>Multi-color gradient glass</GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm">Combines all Brazilian colors in a subtle gradient.</p>
            </GlassCardContent>
          </GlassCard>
        </div>
      </section>

      {/* Blur Variations */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="font-bebas text-4xl mb-6">Blur Variations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard blur="sm">
            <GlassCardHeader>
              <GlassCardTitle>Small Blur</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm">Minimal blur effect (6px)</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard blur="md">
            <GlassCardHeader>
              <GlassCardTitle>Medium Blur</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm">Standard blur effect (12px)</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard blur="lg">
            <GlassCardHeader>
              <GlassCardTitle>Large Blur</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm">Maximum blur effect (20px)</p>
            </GlassCardContent>
          </GlassCard>
        </div>
      </section>

      {/* Glass Buttons */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="font-bebas text-4xl mb-6">Glass Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <GlassButton>Default Glass</GlassButton>
          <GlassButton variant="green" glow>Verde Brasil</GlassButton>
          <GlassButton variant="yellow" glow>Amarelo Ouro</GlassButton>
          <GlassButton variant="blue" glow>Azul Celeste</GlassButton>
          <GlassButton variant="dark">Dark Glass</GlassButton>
          <GlassButton variant="tint">Gradient Tint</GlassButton>
        </div>

        <h3 className="font-bebas text-2xl mt-8 mb-4">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <GlassButton size="sm" variant="green">Small</GlassButton>
          <GlassButton size="default" variant="green">Default</GlassButton>
          <GlassButton size="lg" variant="green">Large</GlassButton>
          <GlassButton size="icon" variant="green">
            <Star className="h-4 w-4" />
          </GlassButton>
        </div>
      </section>

      {/* Glass Modal */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="font-bebas text-4xl mb-6">Glass Modal</h2>
        <div className="flex gap-4">
          <GlassModal open={modalOpen} onOpenChange={setModalOpen}>
            <GlassModalTrigger asChild>
              <GlassButton variant="green">Open Default Modal</GlassButton>
            </GlassModalTrigger>
            <GlassModalContent>
              <GlassModalHeader>
                <GlassModalTitle>Glass Modal Example</GlassModalTitle>
                <GlassModalDescription>
                  This modal uses glassmorphic styling for a modern, transparent look.
                </GlassModalDescription>
              </GlassModalHeader>
              <div className="py-4">
                <p className="text-sm">Modal content goes here with beautiful glass effect.</p>
              </div>
            </GlassModalContent>
          </GlassModal>

          <GlassModal>
            <GlassModalTrigger asChild>
              <GlassButton variant="dark">Open Dark Modal</GlassButton>
            </GlassModalTrigger>
            <GlassModalContent variant="dark">
              <GlassModalHeader>
                <GlassModalTitle className="text-white">Dark Glass Modal</GlassModalTitle>
                <GlassModalDescription className="text-gray-300">
                  Dark variant for better contrast
                </GlassModalDescription>
              </GlassModalHeader>
              <div className="py-4">
                <p className="text-sm text-gray-300">Dark glass effect for dramatic presentations.</p>
              </div>
            </GlassModalContent>
          </GlassModal>
        </div>
      </section>

      {/* Glow Effects */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="font-bebas text-4xl mb-6">Glow Effects</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center activity-glow-blue">
            <Zap className="w-12 h-12 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Blue Glow</p>
          </Card>
          <Card className="p-6 text-center activity-glow-yellow">
            <Star className="w-12 h-12 mx-auto mb-2 text-amarelo-ouro" />
            <p className="font-medium">Yellow Glow</p>
          </Card>
          <Card className="p-6 text-center activity-glow-green">
            <Shield className="w-12 h-12 mx-auto mb-2 text-verde-brasil" />
            <p className="font-medium">Green Glow</p>
          </Card>
          <Card className="p-6 text-center activity-glow-orange">
            <Flame className="w-12 h-12 mx-auto mb-2 text-laranja-destaque" />
            <p className="font-medium">Orange Glow</p>
          </Card>
        </div>
      </section>

      {/* Typography */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="font-bebas text-4xl mb-6">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="font-bebas text-6xl">Bebas Neue - Display Font</h1>
            <p className="text-muted-foreground">Used for headings and impactful text</p>
          </div>
          <div>
            <h2 className="font-oswald text-4xl font-bold">Oswald - Secondary Display</h2>
            <p className="text-muted-foreground">Alternative display font for variety</p>
          </div>
          <div>
            <p className="font-inter text-lg">Inter - Body Text</p>
            <p className="text-muted-foreground">Primary font for readability and elegance</p>
          </div>
        </div>
      </section>

      {/* Animations */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="font-bebas text-4xl mb-6">Animations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="animate-pulse">
              <Heart className="w-12 h-12 mx-auto text-vermelho-alerta" />
              <p className="mt-2">Pulse</p>
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="animate-bounce">
              <Trophy className="w-12 h-12 mx-auto text-amarelo-ouro" />
              <p className="mt-2">Bounce</p>
            </div>
          </Card>
          <Card className="p-6 text-center">
            <div className="animate-flicker">
              <Flame className="w-12 h-12 mx-auto text-laranja-destaque flame-glow" />
              <p className="mt-2">Flicker</p>
            </div>
          </Card>
          <Card className="p-6 text-center legendary-glow">
            <Star className="w-12 h-12 mx-auto text-amarelo-ouro" />
            <p className="mt-2">Golden Glow</p>
          </Card>
        </div>
      </section>

      {/* Gradients */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="font-bebas text-4xl mb-6">Gradients</h2>
        <div className="space-y-4">
          <div className="h-32 rounded-lg bg-brasil-gradient"></div>
          <div className="h-32 rounded-lg bg-sunset-gradient"></div>
          <div className="h-32 rounded-lg bg-gradient-to-r from-verde-brasil to-amarelo-ouro"></div>
          <div className="h-32 rounded-lg bg-gradient-to-r from-azul-celeste via-amarelo-ouro to-verde-brasil"></div>
        </div>
      </section>
    </div>
  );
}