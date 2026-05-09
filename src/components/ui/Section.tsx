import type { ReactNode } from "react";

type Tone = "creme" | "sonnengelb" | "weiss";

const TONES: Record<Tone, string> = {
  creme: "bg-creme",
  sonnengelb: "bg-sonnengelb",
  weiss: "bg-white",
};

export function Section({
  tone = "creme",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={TONES[tone]}>
      <div className={`mx-auto max-w-5xl px-4 py-16 ${className ?? ""}`}>
        {children}
      </div>
    </section>
  );
}
