import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Build or Buy — Decision Framework Tool",
    short_name: "Build or Buy",
    description:
      "Free build vs. buy decision tool for product, engineering, and business teams. Create structured rubrics, score dimensions, collect stakeholder input, and export results.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F6FA",
    theme_color: "#1A2744",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
