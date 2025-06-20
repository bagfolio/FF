# Position Selection Page - Responsive Testing Guide

## Testing Instructions

### Debug Grid
- **Toggle Grid**: Press `Ctrl+G` to show/hide the alignment grid
- **Red Lines**: Vertical position markers
- **Blue Lines**: Horizontal position markers
- **Green Lines**: Center cross reference

## Device Testing Matrix

### Mobile Devices
1. **iPhone SE (1st gen)** - 320x568
   - Smallest supported screen
   - Jersey size: 64x64px (w-16 h-16)
   - Text size: text-xl (20px)
   - Field padding: px-4 (16px)

2. **iPhone 8** - 375x667
   - Standard small phone
   - Jersey maintains 64x64px
   - Position labels visible below jerseys

3. **iPhone 14 Pro** - 393x852
   - Modern phone with notch
   - Safe area padding applied
   - Touch targets verified ≥ 44px

4. **Samsung Galaxy S21** - 360x800
   - Android standard
   - Consistent spacing maintained

5. **Pixel 6** - 412x915
   - Large Android phone
   - All positions visible without scroll

### Tablet Devices
6. **iPad Mini** - 768x1024
   - Breakpoint transition (sm:)
   - Jersey size: 80x80px (w-20 h-20)
   - Text size: text-2xl (24px)
   - Field padding: px-8 (32px)

7. **iPad Pro 11"** - 834x1194
   - Large tablet view
   - Full tooltips visible

### Desktop
8. **MacBook Air** - 1280x800
   - Standard laptop
   - Full formation clearly visible

9. **Desktop** - 1920x1080
   - Large screen
   - Maximum field size (900px)

## Key Responsive Features

### Jersey Sizing
```css
Mobile (<640px): w-16 h-16 (64x64px)
Tablet+ (≥640px): w-20 h-20 (80x80px)
```

### Text Sizing
```css
Jersey Numbers: text-xl sm:text-2xl
Position Labels: text-base sm:text-lg
Legend Text: text-xs sm:text-sm
```

### Spacing
```css
Container Padding: px-4 sm:px-8
Tooltip Margin: mb-2 sm:mb-4
Shadow Size: w-12 h-2 sm:w-14 sm:h-3
```

### Mobile-Only Features
- Position abbreviations (GK, LB, etc.) below jerseys
- Simplified tooltips (no descriptions)
- Touch target minimum 44x44px enforced

## Position Alignment Verification

### Wing Players (5-unit margin from edge)
- **Left Wing (11)**: x=25 (15 units from left edge)
- **Right Wing (7)**: x=75 (15 units from right edge)
- **Left Back (6)**: x=25
- **Right Back (2)**: x=75

### Central Players
- **Goalkeeper (1)**: x=50, y=82
- **Center Backs (3,4)**: x=37/63, y=73
- **Midfielders (5,8,10)**: x=32/50/68, y=48/46/48
- **Striker (9)**: x=50, y=20

### Field Boundaries
- Outer field: 10-90 (80x80 units)
- Penalty areas: y=10-28 and y=72-90
- Center circle: r=10 at (50,50)

## Testing Checklist

### Visual Alignment
- [ ] All players within field boundaries
- [ ] No jerseys touching field lines
- [ ] Even spacing between positions
- [ ] Formation shape maintained

### Responsive Behavior
- [ ] Jerseys scale appropriately
- [ ] Text remains readable
- [ ] Touch targets ≥ 44px on mobile
- [ ] No horizontal scroll at any size

### Interactions
- [ ] Tap/click selects position
- [ ] Hover shows tooltip (desktop)
- [ ] Selected state clearly visible
- [ ] Continue button activates

### Performance
- [ ] Smooth animations
- [ ] No layout shifts
- [ ] Fast touch response
- [ ] Grid toggle works (Ctrl+G)

## Known Issues & Solutions

1. **Tooltip Overflow**: On very small screens (320px), tooltips may exceed viewport
   - Solution: Added max-width and responsive text sizes

2. **Position Labels**: May overlap on extremely narrow screens
   - Solution: Added mobile-only abbreviations below jerseys

3. **Touch Precision**: Small jerseys harder to tap precisely
   - Solution: touch-target class ensures 44px minimum hit area

## Browser Compatibility
- Chrome/Edge: Full support
- Safari: Full support (tested on iOS)
- Firefox: Full support
- Samsung Internet: Full support