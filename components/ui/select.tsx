import * as React from "react"

import { cn } from "@/lib/utils"

export interface SelectProps extends React.ComponentProps<"select"> {
  error?: boolean
  errorMessage?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, errorMessage, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          data-slot="select"
          className={cn(
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            // Styling de l'icône flèche
            "appearance-none bg-[length:16px_16px] bg-[position:right_0.5rem_center] bg-no-repeat",
            "bg-[image:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')]",
            "pr-9", // Padding à droite pour l'icône
            // Erreur state - doit venir après les styles de base pour override
            error ? "!border-red-500 dark:!border-red-500 focus-visible:!ring-red-500/20" : "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          ref={ref}
          aria-invalid={error || undefined}
          {...props}
        >
          {children}
        </select>
        {error && errorMessage && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select }
