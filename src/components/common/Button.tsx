import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  asChild?: boolean
  isLoading?: boolean
  children: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: 'border border-field-green !bg-field-green !text-paper-light shadow-field-sm hover:!bg-forest-green hover:-translate-y-px [&_*]:!text-paper-light [&_svg]:!text-paper-light',
  secondary: 'border border-field-green/35 bg-paper-light/72 text-field-green shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] hover:bg-mist-blue/35 hover:-translate-y-px',
  ghost: 'text-field-green hover:bg-sprout-green/12 hover:-translate-y-px [&_svg]:text-current',
  danger: 'border border-brick bg-brick text-paper-white hover:bg-[#7f3c2d] hover:-translate-y-px',
}

export function Button({
  variant = 'primary',
  asChild,
  isLoading,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    'interactive-press inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-4 py-2 text-sm font-semibold transition duration-300 ease-field disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    className,
  )

  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {children}
      </Slot>
    )
  }

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
      {children}
    </button>
  )
}
