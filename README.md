# Triage - Embedded Security Website

A stunning, one-of-a-kind website for Triage, an AI-native security startup. Built with Next.js, TypeScript, Framer Motion, and Tailwind CSS.

## Features

### Unique Animations & Interactions

- **Custom Cursor**: A Mac-style cursor that follows mouse movement with blur and acceleration effects when scrolling
- **Scroll-Triggered Animations**: All content and animations are tied to user scrolling
- **Red Highlight Effects**: Dynamic red highlight marks appear as you scroll through different content zones
- **Gradient Orbs**: Animated gradient backgrounds with floating orbs
- **Logo Carousel**: Seamlessly rotating customer logos with horizontal animation

### Design

- **Color Palette**:
  - Pale Wood (#f2cbbd) - Primary text
  - Dark Cyan (#038c8c) - Accents and highlights
  - Midnight Green (#0e3638) - Main background
- **Typography**:
  - Akkurat - Main interface font
  - Fragment Mono - Code and technical elements
- **Grain Texture**: Subtle grain overlay for aesthetic depth
- **Gradients**: Beautiful gradient backgrounds throughout

### Sections

1. **Hero Section**: Eye-catching gradient background with animated orbs and bold messaging
2. **Logo Carousel**: Rotating display of customer/partner logos
3. **Problem Statement**: Three-column feature grid
4. **Lifecycle Flow**: Six-step development lifecycle with creative product screenshot integration
5. **Evidence Packet**: Detailed explanation with visual examples
6. **Learning Agents**: Two-column feature explanation with dashboard screenshot
7. **Metrics**: Four-column statistics display
8. **Governance**: Management interface showcase
9. **CTA Section**: Final call-to-action with gradient background
10. **Footer**: Simple, clean footer with navigation

### Product Screenshot Integration

Product images are creatively integrated throughout the lifecycle section:
- Dashboard.png - Planning phase
- IDEandassistant.png - Coding phase
- Terminal.png - Build & Test phase
- PR.png - Review phase
- Diffs.png - Release phase
- Fixtimeline.png - Operate phase
- Additional screenshots used in Evidence and Learning sections

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Server

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with custom fonts
│   ├── page.tsx            # Main page with all sections
│   ├── globals.css         # Global styles with grain texture
│   ├── auto-patch/         # Auto-patch feature page
│   ├── careers/            # Careers page
│   ├── cicd-integration/   # CI/CD integration page
│   ├── rlhf-learning/      # RLHF learning page
│   ├── security-scanner/   # Security scanner page
│   └── team/               # Team page
├── components/
│   ├── AdvancedIDE.tsx     # Advanced IDE component
│   ├── AnimatedWorkflow.tsx # Animated workflow component
│   ├── GitHubElements.tsx  # GitHub UI elements
│   ├── PhaseVisuals.tsx    # Phase visualization components
│   └── SecurityHeatmap.tsx # Security heatmap component
├── public/
│   ├── logo.png            # Paladin logo
│   ├── cursor.png          # Mac cursor icon
│   ├── grain.jpg           # Grain texture
│   ├── images/             # Product screenshots
│   ├── logos/              # Company/partner logos
│   └── user_logos/         # User company logos
└── [config files]
```

## Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **Framer Motion** - Animation library
- **React 19** - UI library

## Key Features Implemented

### Custom Cursor
- Follows mouse with smooth spring physics
- Blurs and scales when scrolling rapidly
- Creates red highlight marks at specific scroll zones
- Mix-blend-mode for visibility on all backgrounds

### Scroll Animations
- Scroll-triggered section reveals
- Parallax effects on hero section
- Staggered animations for lists and grids
- Image hover effects with scale transforms

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

## Performance

- Image optimization with Next.js Image component
- Lazy loading for images
- CSS optimization with Tailwind
- Smooth 60fps animations with Framer Motion

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - Triage 2025
