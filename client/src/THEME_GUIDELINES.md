# Dark Glassmorphic Theme Guidelines

## Overview
This document outlines the design principles and implementation guidelines for maintaining a consistent dark glassmorphic theme throughout the application.

## Core Principles

### 1. Always Use Glass Morphism for Containers
```tsx
// ✅ DO: Use glass morphism utilities
<Card className="glass-morph border-white/10">

// ❌ DON'T: Use solid backgrounds
<Card className="bg-white border-gray-200">
```

### 2. Text Color Hierarchy
```tsx
// Primary text
<h1 className="text-white">Title</h1>

// Secondary text
<p className="text-white/60">Description</p>

// Muted text
<span className="text-white/40">Metadata</span>
```

### 3. Color-Specific Glass Variants
Use predefined glass variants for colored elements:
- `glass-morph-green` - Success, primary actions
- `glass-morph-yellow` - Warnings, achievements
- `glass-morph-blue` - Information, technical
- `glass-morph-purple` - Premium, special
- `glass-morph-orange` - Alerts, strength
- `glass-morph-pink` - Social, community

### 4. Interactive Elements
```tsx
// Buttons with glass effect
<Button className="glass-morph hover:bg-white/10">

// Cards with hover states
<Card className="glass-morph hover:border-white/20 transition-all duration-300">
```

## Component-Specific Guidelines

### Navigation
- Use `glass-morph` with sticky positioning
- Ensure proper z-index for layering
- Add backdrop blur for depth

### Cards
```tsx
<Card className="glass-morph border-white/10 hover:border-white/20">
  <CardHeader className="border-b border-white/10">
    <CardTitle className="text-white">Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-white/60">Content</p>
  </CardContent>
</Card>
```

### Modals
```tsx
import { GlassModal, GlassModalContent } from "@/components/ui/glass-modal";

<GlassModal>
  <GlassModalContent variant="dark">
    {/* Modal content */}
  </GlassModalContent>
</GlassModal>
```

### Stats Components
```tsx
import { GlassStats } from "@/components/ui/glass-stats";

<GlassStats
  title="Metric"
  value="123"
  icon={<Icon />}
  variant="green"
  trend={{ value: 5, direction: "up" }}
/>
```

### Tabs
```tsx
import { GlassTabs, GlassTabsList, GlassTabsTrigger } from "@/components/ui/glass-tabs";

<GlassTabs>
  <GlassTabsList>
    <GlassTabsTrigger value="tab1">Tab 1</GlassTabsTrigger>
  </GlassTabsList>
</GlassTabs>
```

## Canvas-Based Components
For components using canvas (charts, visualizations):
```javascript
// Detect theme
const isDarkMode = document.documentElement.classList.contains('dark');

// Use theme-aware colors
const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb';
const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#374151';
```

## Form Elements
```tsx
// Glass input styling
<input className="glass-input" />

// Select dropdowns
<SelectTrigger className="glass-morph border-white/10">
<SelectContent className="glass-morph-dark border-white/10">
```

## Best Practices

### 1. Consistency
- Always use the predefined glass utilities
- Don't create one-off glass effects
- Follow the established color hierarchy

### 2. Performance
- Use `glass-morph-sm` for mobile devices
- Consider reducing blur on lower-end devices
- Batch animations when possible

### 3. Accessibility
- Maintain WCAG AA contrast ratios
- Test with screen readers
- Provide focus indicators

### 4. Responsive Design
```tsx
// Use responsive glass utilities
<div className="glass-morph sm:glass-morph-lg">
```

## Common Pitfalls to Avoid

1. **Hardcoded Light Colors**
   ```tsx
   // ❌ Avoid
   className="bg-gray-100 text-gray-900"
   
   // ✅ Use
   className="glass-morph text-white"
   ```

2. **Missing Hover States**
   ```tsx
   // ❌ Avoid
   className="glass-morph"
   
   // ✅ Use
   className="glass-morph hover:border-white/20"
   ```

3. **Inconsistent Borders**
   ```tsx
   // ❌ Avoid
   className="border-gray-300"
   
   // ✅ Use
   className="border-white/10"
   ```

## Theme Testing Checklist

- [ ] Component works in both light and dark modes
- [ ] Text has proper contrast ratios
- [ ] Hover states are visible
- [ ] Glass effects render correctly
- [ ] No hardcoded light colors
- [ ] Canvas elements are theme-aware
- [ ] Form inputs maintain readability

## CSS Variables Reference

```css
/* Glass backgrounds */
--glass-bg: rgba(255, 255, 255, 0.03);
--glass-bg-hover: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-border-hover: rgba(255, 255, 255, 0.12);

/* Card backgrounds */
--card-bg: rgba(255, 255, 255, 0.02);
--card-bg-hover: rgba(255, 255, 255, 0.04);
--modal-bg: rgba(0, 0, 0, 0.6);

/* Text hierarchy */
--text-primary: rgba(255, 255, 255, 1);
--text-secondary: rgba(255, 255, 255, 0.6);
--text-muted: rgba(255, 255, 255, 0.4);
```

## Migration Guide

When updating existing components:

1. Replace `bg-*-50/100/200` with appropriate `glass-morph-*` variant
2. Update text colors: `text-gray-*` → `text-white/*`
3. Convert borders: `border-*-200/300` → `border-white/10` or `border-*/30`
4. Add hover states for interactive elements
5. Test in dark mode environment

## Questions or Issues?

If you encounter any issues or have questions about implementing the dark glassmorphic theme, please:
1. Check existing components for reference implementations
2. Review the style guide at `/style-guide`
3. Ensure you're using the latest theme utilities