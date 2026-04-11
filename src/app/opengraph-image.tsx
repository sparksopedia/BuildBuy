import { ImageResponse } from "next/og";

export const alt =
  "Build or Buy — The free build vs. buy decision framework for product, engineering, and business teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family
    )}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const cssRes = await fetch(url, {
      headers: {
        // Need a real UA to get back a TTF url; otherwise Google returns woff2
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const match = css.match(
      /src:\s*url\(([^)]+)\)\s*format\(['"]?(truetype|opentype)['"]?\)/
    );
    if (!match) return null;
    const fontRes = await fetch(match[1], { signal: AbortSignal.timeout(8000) });
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    // Network unavailable at build time; fall back to Satori default fonts.
    return null;
  }
}

type FontSpec = {
  name: string;
  data: ArrayBuffer;
  style: "normal";
  weight: 400 | 600 | 700;
};

export default async function Image() {
  // Collect all glyphs needed for subsetting
  const fraunceText = "Build or Buy";
  const dmSansText =
    "The free build vs. buy decision framework. Structured rubrics · Multi-stakeholder scoring · Free & ad-free buildorbuy.app B/B";

  const [fraunces, dmSansRegular, dmSansBold] = await Promise.all([
    loadGoogleFont("Fraunces", 700, fraunceText),
    loadGoogleFont("DM Sans", 400, dmSansText),
    loadGoogleFont("DM Sans", 600, dmSansText),
  ]);

  const fonts: FontSpec[] = [];
  if (fraunces)
    fonts.push({ name: "Fraunces", data: fraunces, style: "normal", weight: 700 });
  if (dmSansRegular)
    fonts.push({ name: "DM Sans", data: dmSansRegular, style: "normal", weight: 400 });
  if (dmSansBold)
    fonts.push({ name: "DM Sans", data: dmSansBold, style: "normal", weight: 600 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background:
            "linear-gradient(135deg, #0F1A30 0%, #1A2744 45%, #2D3F72 100%)",
          color: "#ffffff",
          fontFamily: "DM Sans",
          position: "relative",
        }}
      >
        {/* Decorative accent ring */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -140,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(123, 163, 212, 0.10)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.04)",
            display: "flex",
          }}
        />

        {/* Top row: brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              borderRadius: 12,
              background: "rgba(255,255,255,0.10)",
              border: "1.5px solid rgba(255,255,255,0.18)",
              fontFamily: "DM Sans",
              fontWeight: 600,
              fontSize: 22,
              color: "#ffffff",
              letterSpacing: 1,
            }}
          >
            B/B
          </div>
          <div
            style={{
              fontFamily: "DM Sans",
              fontWeight: 600,
              fontSize: 22,
              color: "rgba(255,255,255,0.78)",
              letterSpacing: 0.3,
              display: "flex",
            }}
          >
            buildorbuy.app
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontFamily: "Fraunces",
              fontWeight: 700,
              fontSize: 124,
              lineHeight: 1.02,
              color: "#ffffff",
              letterSpacing: -2,
              display: "flex",
            }}
          >
            Build or Buy
          </div>
          <div
            style={{
              fontFamily: "DM Sans",
              fontWeight: 400,
              fontSize: 38,
              lineHeight: 1.25,
              color: "rgba(255,255,255,0.82)",
              maxWidth: 920,
              display: "flex",
            }}
          >
            The free build vs. buy decision framework.
          </div>
        </div>

        {/* Bottom row: feature bullets */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            fontFamily: "DM Sans",
            fontWeight: 600,
            fontSize: 22,
            color: "#7BA3D4",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "#7BA3D4",
                display: "flex",
              }}
            />
            Structured rubrics
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "#7BA3D4",
                display: "flex",
              }}
            />
            Multi-stakeholder scoring
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "#7BA3D4",
                display: "flex",
              }}
            />
            Free & ad-free
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    }
  );
}
