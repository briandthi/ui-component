import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import styles from "./TextLoading.module.css"

const textLoadingVariants = cva("relative overflow-hidden text-zinc-500", {
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
})

export interface TextLoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof textLoadingVariants> {
  text?: string
}

const TextLoading = React.forwardRef<HTMLDivElement, TextLoadingProps>(
  ({ className, size, text = "Loading...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          textLoadingVariants({ size, className }),
          styles.loadingContainer
        )}
        {...props}
      >
        <span className={styles.loadingText}>{text}</span>
      </div>
    )
  }
)
TextLoading.displayName = "Loading"

export { TextLoading, textLoadingVariants }
