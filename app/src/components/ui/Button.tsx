import Link from "next/link";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "ghost-light" | "ghost-dark" | "solid-light" | "solid-brand" | "small";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type LinkButtonProps = SharedProps & {
  href: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

type NativeButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

function resolveVariant(variant: ButtonVariant | undefined, className = "") {
  if (variant) return variant;
  if (className.includes("button-on-dark")) return "ghost-light";
  if (className.includes("button-primary")) return "solid-brand";
  if (className.includes("button-secondary")) return "ghost-dark";
  return "ghost-dark";
}

function normalizeClassName(className = "") {
  return className.replace(/\bbutton-(?:primary|secondary|on-dark)\b/g, "").replace(/\s+/g, " ").trim();
}

const Button = forwardRef<HTMLButtonElement, LinkButtonProps | NativeButtonProps>(function Button(props, ref) {
  const { children, className = "", variant, ...rest } = props;
  const resolvedVariant = resolveVariant(variant, className);
  const classes = `desco-button desco-button-${resolvedVariant} ${normalizeClassName(className)}`.trim();

  if ("href" in rest && rest.href) {
    const { href, ...linkProps } = rest;
    return <Link href={href} className={classes} {...linkProps}>{children}</Link>;
  }

  return <button ref={ref} className={classes} {...rest as ButtonHTMLAttributes<HTMLButtonElement>}>{children}</button>;
});

export default Button;
