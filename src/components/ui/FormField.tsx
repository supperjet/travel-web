import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

interface FieldFrameProps {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}

function FieldFrame({ label, htmlFor, hint, error, children, className }: FieldFrameProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label className="text-xs font-semibold text-foreground" htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? <p className="m-0 text-xs text-danger" role="alert">{error}</p> : hint ? <p className="m-0 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

const controlClass = "h-12 w-full rounded-xl border border-border bg-white px-4 text-base text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-[var(--ll-ring)] disabled:opacity-55";

export function TextField({ label, hint, error, className, id, ...props }: InputHTMLAttributes<HTMLInputElement> & Omit<FieldFrameProps, "htmlFor" | "children">) {
  const inputId = id ?? props.name;
  if (!inputId) throw new Error("TextField requires id or name");
  return <FieldFrame label={label} htmlFor={inputId} hint={hint} error={error} className={className}><input id={inputId} className={controlClass} aria-invalid={Boolean(error)} {...props} /></FieldFrame>;
}

export function SelectField({ label, hint, error, className, id, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & Omit<FieldFrameProps, "htmlFor">) {
  const inputId = id ?? props.name;
  if (!inputId) throw new Error("SelectField requires id or name");
  return <FieldFrame label={label} htmlFor={inputId} hint={hint} error={error} className={className}><select id={inputId} className={controlClass} aria-invalid={Boolean(error)} {...props}>{children}</select></FieldFrame>;
}
