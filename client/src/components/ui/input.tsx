import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'flex h-11 w-full rounded-xl bg-[var(--card)] px-4 py-2 text-sm',
                    'border border-[var(--border)] transition-all duration-300',
                    'placeholder:text-[var(--foreground-subtle)]',
                    'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-glow)]',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export { Input };
