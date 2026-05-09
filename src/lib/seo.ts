import type { Metadata } from "next";

const SITE_NAME = "Dresdner Tages Eltern e.V.";

export function buildMetadata(opts: {
  title: string;
  description?: string;
}): Metadata {
  return {
    title: `${opts.title} – ${SITE_NAME}`,
    description: opts.description,
  };
}
