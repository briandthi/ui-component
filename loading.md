# Loading Component

A React component for displaying a loading indicator with a shimmer effect.

## Import

```tsx
import { Loading } from "@/components/ui/loading";
```

## Code

### loading.tsx

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import styles from "./Loading.module.css";

const loadingVariants = cva("relative overflow-hidden text-zinc-500", {
  variants: {
    size: {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, size, text = "Loading...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          loadingVariants({ size, className }),
          styles.loadingContainer
        )}
        {...props}
      >
        <span className={styles.loadingText}>{text}</span>
      </div>
    );
  }
);
Loading.displayName = "Loading";

export { Loading, loadingVariants };
```

### Loading.module.css

```css
.loadingContainer {
  position: relative;
  overflow: hidden;
}

.loadingText {
  display: inline-block;
  position: relative;
}

.loadingText::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) -20%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 120%
  );
  animation: shimmer 1.5s infinite ease-in-out;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

## Usage

### Basic

```tsx
<Loading />
```

### With custom text

```tsx
<Loading text="Loading in progress..." />
```

### With different sizes

```tsx
<Loading size="sm" />
<Loading size="default" />
<Loading size="lg" />
```

## Props

| Prop        | Type                        | Default         | Description                          |
| ----------- | --------------------------- | --------------- | ------------------------------------ |
| `text`      | `string`                    | `"Thinking..."` | Text to display during loading       |
| `size`      | `"default" \| "sm" \| "lg"` | `"default"`     | Text size                            |
| `className` | `string`                    | -               | Additional CSS classes               |

## Variants

### Sizes

- `sm` - Small text (text-xs)
- `default` - Medium size (text-sm)
- `lg` - Large text (text-base)

## Complete Example

```tsx
import { Loading } from "@/components/ui/loading";

export default function LoadingExample() {
  return (
    <div className="space-y-4">
      {/* Default size */}
      <Loading />

      {/* Small size with custom text */}
      <Loading size="sm" text="Loading data..." />

      {/* Large size */}
      <Loading size="lg" className="my-8" />
    </div>
  );
}
```

## Customization

The component can be customized via:

- Size selection
- Displayed text
- Additional CSS classes through the `className` prop
- Modifying the `Loading.module.css` file for animation

## Technical Notes

- Uses CSS Modules for style isolation
- Built with class-variance-authority for variant management
- TypeScript compatible
- No additional Tailwind configuration required

## Dependencies

- class-variance-authority
- clsx/tailwind-merge (via `cn` utility)
- React 18+

```
This simplified version focuses only on:
- Size customization
- Text customization
- Adding custom classes
- Default shimmer effect
```
