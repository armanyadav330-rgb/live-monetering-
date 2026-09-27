import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface CircularSpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Spinner diameter. Preset ('xs' | 'sm' | 'md' | 'lg' | 'xl') or pixel number.
   * xs = 18px, sm = 24px, md = 42px, lg = 56px, xl = 76px.
   * Default: 'md' (42px)
   */
  size?: SpinnerSize;
  /**
   * Speed in seconds per full 360-degree rotation cycle.
   * Recommended range: 1.2 to 1.5 seconds.
   * Default: 1.3
   */
  speed?: number;
  /**
   * Array of 12 hex or rgb color strings for the 12 capsule bars.
   * Starts at top (12 o'clock, 0 deg) and proceeds clockwise.
   * The top bars are dark blue and gradually transition to light cyan around the right side.
   */
  colors?: string[];
  /**
   * Optional primary color to generate a custom 12-bar gradient with.
   * Used if `colors` is not provided.
   */
  primaryColor?: string;
  /**
   * Optional secondary color for the custom 12-bar gradient.
   * Used if `colors` is not provided.
   */
  secondaryColor?: string;
  /**
   * Reverse direction (counter-clockwise)
   * Default: false
   */
  reverse?: boolean;
  /**
   * Accessible ARIA label for screen readers.
   * Default: 'Loading...'
   */
  ariaLabel?: string;
  /**
   * Additional CSS classes.
   */
  className?: string;
}

/**
 * Utility to generate a 12-step color array interpolating between two hex colors.
 */
export function generateSpinnerColors(startHex: string, endHex: string): string[] {
  const parseHex = (hex: string) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  try {
    const [r1, g1, b1] = parseHex(startHex);
    const [r2, g2, b2] = parseHex(endHex);
    const result: string[] = [];

    // Interpolate around the 12 points
    for (let i = 0; i < 12; i++) {
      const factor = i / 11;
      const r = Math.round(r1 + factor * (r2 - r1));
      const g = Math.round(g1 + factor * (g2 - g1));
      const b = Math.round(b1 + factor * (b2 - b1));
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      result.push(hex);
    }
    return result;
  } catch {
    return DEFAULT_SPINNER_COLORS;
  }
}

/**
 * 12-bar blue-to-cyan color progression matching the reference design:
 * Top (12 o'clock) starts at deep dark sapphire blue (#093b7b), smoothly
 * transitions clockwise through vivid blue, bright azure, electric cyan,
 * into light sky aqua and ice cyan before looping back to the top.
 */
export const DEFAULT_SPINNER_COLORS: string[] = [
  '#093b7b', // 0: 12 o'clock (top) - deep dark navy blue
  '#0f4b9a', // 1: 1 o'clock - rich sapphire blue
  '#1560b7', // 2: 2 o'clock - royal cobalt blue
  '#1d77d4', // 3: 3 o'clock (right) - vibrant blue
  '#2590ef', // 4: 4 o'clock - bright azure
  '#2ca9fb', // 5: 5 o'clock - vivid cyan-blue
  '#38c3fb', // 6: 6 o'clock (bottom) - electric cyan
  '#59d4fc', // 7: 7 o'clock - aqua cyan
  '#83e3fd', // 8: 8 o'clock - soft sky cyan
  '#adf0fe', // 9: 9 o'clock (left) - pale ice cyan
  '#cff5fe', // 10: 10 o'clock - delicate ice blue
  '#eaf8fe', // 11: 11 o'clock - translucent faint cyan
];

const SIZE_MAP: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 18,
  sm: 24,
  md: 42,
  lg: 56,
  xl: 76,
};

/**
 * Professional Circular Loading Spinner
 * - 12 rounded pill-shaped bars arranged radially at 30° intervals
 * - Fully rounded capsule ends (rx=3.8, ry=3.8)
 * - Blue-to-cyan color progression
 * - Smooth continuous CSS rotation (1.2–1.5s per cycle)
 * - Highly customizable (size, speed, colors)
 */
export const CircularSpinner: React.FC<CircularSpinnerProps> = ({
  size = 'md',
  speed = 1.3,
  colors,
  primaryColor,
  secondaryColor,
  reverse = false,
  ariaLabel = 'Loading...',
  className = '',
  style,
  ...restProps
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 42;
  const barColors = React.useMemo(() => {
    if (colors && colors.length === 12) {
      return colors;
    }
    if (primaryColor && secondaryColor) {
      return generateSpinnerColors(primaryColor, secondaryColor);
    }
    return DEFAULT_SPINNER_COLORS;
  }, [colors, primaryColor, secondaryColor]);

  const direction = reverse ? 'reverse' : 'normal';

  // Capsule bar geometry in 100x100 coordinate space
  // Center is (50, 50). Capsule width: 7.6px, height: 21.5px, rx/ry: 3.8px (fully rounded)
  // Distance from center: inner radius 21.5px, outer radius 43px
  const barWidth = 7.6;
  const barHeight = 21.5;
  const barRadius = barWidth / 2;
  const barX = 50 - barRadius;
  const barY = 7;

  return (
    <svg
      role="status"
      aria-label={ariaLabel}
      viewBox="0 0 100 100"
      width={pixelSize}
      height={pixelSize}
      className={`circular-spinner-animated select-none shrink-0 ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        animation: `circular-spinner-spin ${speed}s linear infinite ${direction}`,
        transformOrigin: '50% 50%',
        willChange: 'transform',
        ...style,
      }}
      {...restProps}
    >
      <defs>
        <style>
          {`
            @keyframes circular-spinner-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </defs>
      {/* 12 rounded pill-shaped bars evenly arranged at 30° intervals */}
      {barColors.map((color, index) => {
        const angle = index * 30;
        return (
          <rect
            key={index}
            x={barX}
            y={barY}
            width={barWidth}
            height={barHeight}
            rx={barRadius}
            ry={barRadius}
            fill={color}
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
    </svg>
  );
};

export interface LoadingContainerProps {
  size?: SpinnerSize;
  speed?: number;
  colors?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

/**
 * Centered container for inline page/section loading states.
 * Perfectly centers the spinner horizontally and vertically.
 */
export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  size = 'md',
  speed = 1.3,
  colors,
  primaryColor,
  secondaryColor,
  label,
  description,
  className = '',
  minHeight = 'min-h-[220px]',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center ${minHeight} ${className}`}
      role="status"
    >
      <CircularSpinner
        size={size}
        speed={speed}
        colors={colors}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
      {label && (
        <div className="mt-3.5 text-sm font-semibold text-slate-700 tracking-tight">
          {label}
        </div>
      )}
      {description && (
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export interface LoadingOverlayProps {
  size?: SpinnerSize;
  speed?: number;
  label?: React.ReactNode;
  description?: React.ReactNode;
  fullScreen?: boolean;
}

/**
 * Fullscreen or absolute overlay loading screen with backdrop.
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  size = 'lg',
  speed = 1.3,
  label = 'Loading...',
  description,
  fullScreen = true,
}) => {
  return (
    <div
      className={`${
        fullScreen
          ? 'fixed inset-0 z-50 bg-white/90 backdrop-blur-xs'
          : 'absolute inset-0 z-30 bg-white/80 backdrop-blur-2xs'
      } flex items-center justify-center p-4 transition-opacity duration-300`}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/95 shadow-xl border border-slate-100 max-w-xs w-full">
        <CircularSpinner size={size} speed={speed} />
        {label && (
          <div className="mt-4 text-sm font-bold text-slate-800 tracking-tight">
            {label}
          </div>
        )}
        {description && (
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default CircularSpinner;
