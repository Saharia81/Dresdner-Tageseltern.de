"use client";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label="Nach oben"
      className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-text-soft hover:text-korallenrot transition-colors touch-manipulation [&>*]:pointer-events-none"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
