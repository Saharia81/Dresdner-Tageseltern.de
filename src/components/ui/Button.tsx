import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary";

const STYLES: Record<Variant, string> = {
  primary:
    "bg-korallenrot text-white hover:bg-korallenrot-dunkel",
  secondary:
    "bg-white text-text border border-text/10 hover:border-text/30",
};

const BASE =
  "inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition-colors";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  return (
    <button className={`${BASE} ${STYLES[variant]} ${className ?? ""}`} {...rest}>
      {children}
    </button>
  );
}

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
};

export function LinkButton({ variant = "primary", className, children, ...rest }: LinkButtonProps) {
  return (
    <Link className={`${BASE} ${STYLES[variant]} ${className ?? ""}`} {...rest}>
      {children}
    </Link>
  );
}
