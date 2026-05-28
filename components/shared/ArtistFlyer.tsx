"use client";

import { useState, useEffect, useRef } from "react";
import { EVENTS } from "@/app/lib/analytics-events";

interface ArtistFlyerProps {
  artistName: string;
  artistHandle: string;
  amplifyUrl: string;
}

// Simple font-size heuristic so long names don't overflow the header
function headerFontSize(name: string): string {
  if (name.length > 18) return "32px";
  if (name.length > 12) return "44px";
  return "60px";
}

export function ArtistFlyer({ artistName, artistHandle, amplifyUrl }: ArtistFlyerProps) {
  const [scale, setScale] = useState(1);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setScale(Math.min(1, (window.innerWidth - 32) / 816));
    update();
    const beforePrint = () => setScale(1);
    const afterPrint = update;
    window.addEventListener("resize", update);
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  useEffect(() => {
    if (!qrRef.current) return;
    let cancelled = false;

    import("qr-code-styling").then((mod) => {
      if (cancelled || !qrRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const QRCodeStyling = (mod as any).default ?? mod;
      qrRef.current.innerHTML = "";
      const qr = new QRCodeStyling({
        type: "svg",
        width: 152,
        height: 152,
        data: amplifyUrl,
        qrOptions: { errorCorrectionLevel: "H" as const },
        dotsOptions: { type: "rounded" as const, color: "#000000" },
        cornersSquareOptions: { type: "extra-rounded" as const, color: "#000000" },
        cornersDotOptions: { type: "dot" as const, color: "#000000" },
        backgroundOptions: { color: "#ffffff" },
      });
      qr.append(qrRef.current);
    });

    return () => {
      cancelled = true;
    };
  }, [amplifyUrl]);

  const displayUrl = `AMPLIFY.MUSICDECLARES.NET/A/${artistHandle.toUpperCase()}`;

  return (
    <div
      id="flyer-outer"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3a3a3a 0%, #252525 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "40px 16px",
        gap: "20px",
      }}
    >
      {/* Print button — hidden on print via #flyer-print-btn CSS rule */}
      <button
        id="flyer-print-btn"
        onClick={() => window.print()}
        data-umami-event={EVENTS.FLYER_PRINT}
        data-umami-event-artist={artistHandle}
        style={{
          backgroundColor: "#ffffff",
          border: "none",
          borderRadius: "6px",
          padding: "10px 24px",
          fontFamily: "var(--font-courier-prime), monospace",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Print / Save as PDF
      </button>

      {/* Outer div holds the visual footprint of the scaled canvas */}
      <div
        style={{
          width: `${816 * scale}px`,
          height: `${1056 * scale}px`,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          id="flyer-canvas"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "816px",
            height: "1056px",
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            boxShadow: "0 12px 60px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          {/* ━━━ FLYER ━━━ */}
          <div
            style={{
              width: "816px",
              height: "1056px",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* HEADER BAND */}
            <div
              style={{
                backgroundColor: "#000000",
                padding: "17px 32px 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  color: "#ffffff",
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: headerFontSize(artistName),
                  lineHeight: 1,
                  letterSpacing: "0.05em",
                }}
              >
                {artistName.toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px" }}>
                <div
                  style={{
                    color: "#f5ee80",
                    fontFamily: "var(--font-courier-prime), monospace",
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    lineHeight: 1.55,
                    fontWeight: 700,
                  }}
                >
                  MUSIC DECLARES EMERGENCY
                </div>
              </div>
            </div>

            {/* TAGLINE STRIP — copy placeholder, update before launch */}
            <div
              style={{
                backgroundColor: "#1b4332",
                padding: "6px 32px",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-courier-prime), monospace",
                  fontSize: "9.5px",
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                }}
              >
                EST. 2019 &nbsp;·&nbsp; 1% FOR THE PLANET &nbsp;·&nbsp; EVERY TOUR &nbsp;·&nbsp; EVERY VENUE
              </div>
            </div>

            {/* MAIN HEADLINE */}
            <div
              style={{
                padding: "20px 32px 14px",
                flexShrink: 0,
              }}
            >
              {["THE", "EARTH", "IS OUR", "STAGE."].map((line) => (
                <div
                  key={line}
                  style={{
                    fontFamily: "var(--font-anton), sans-serif",
                    fontSize: "108px",
                    lineHeight: 0.89,
                    color: "#000000",
                    display: "block",
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* ACCENT RULE */}
            <div
              style={{
                height: "5px",
                backgroundColor: "#1b4332",
                margin: "0 32px",
                flexShrink: 0,
              }}
            />

            {/* MANIFESTO — copy placeholder, update before launch */}
            <div
              style={{
                padding: "18px 32px 12px",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-courier-prime), monospace",
                  fontSize: "14.5px",
                  lineHeight: 1.72,
                  color: "#111111",
                  margin: "0 0 14px 0",
                  maxWidth: "590px",
                }}
              >
                We pledge 1% of every ticket sold to frontline climate<br />
                organizations—from wildfire relief to youth advocacy and<br />
                clean energy transition. No asterisks. No exceptions.
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                }}
              >
                <div
                  style={{
                    width: "9px",
                    height: "9px",
                    backgroundColor: "#1b4332",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-anton), sans-serif",
                    fontSize: "20px",
                    color: "#000000",
                    letterSpacing: "0.035em",
                  }}
                >
                  JOIN THOUSANDS OF FANS ALREADY TAKING ACTION
                </div>
              </div>
            </div>

            {/* QR CODE SECTION */}
            <div
              style={{
                backgroundColor: "#1b4332",
                margin: "14px 32px",
                padding: "26px 30px",
                display: "flex",
                alignItems: "center",
                gap: "32px",
                flexShrink: 0,
              }}
            >
              {/* QR Code on white card */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "10px",
                  flexShrink: 0,
                  lineHeight: 0,
                }}
              >
                <div ref={qrRef} style={{ width: "152px", height: "152px" }} />
              </div>

              {/* CTA Text */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-anton), sans-serif",
                    fontSize: "52px",
                    lineHeight: 0.88,
                    color: "#ffffff",
                    marginBottom: "16px",
                  }}
                >
                  SCAN TO<br />JOIN THE<br />MOVEMENT
                </div>
                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.3)",
                    paddingTop: "11px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-courier-prime), monospace",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.78)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      lineHeight: 1.7,
                    }}
                  >
                    {displayUrl}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-courier-prime), monospace",
                      fontSize: "10.5px",
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      marginTop: "3px",
                    }}
                  >
                    Takes 30 seconds. Zero cost to you.
                  </div>
                </div>
              </div>
            </div>

            {/* FLEX SPACER */}
            <div style={{ flexGrow: 1 }} />

            {/* FOOTER — copy placeholder, update before launch */}
            <div
              style={{
                backgroundColor: "#000000",
                padding: "14px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-anton), sans-serif",
                  fontSize: "15px",
                  color: "#ffffff",
                  letterSpacing: "0.14em",
                }}
              >
                EVERY SHOW. EVERY TICKET. EVERY FAN.
              </span>
              <span
                style={{
                  fontFamily: "var(--font-courier-prime), monospace",
                  fontSize: "12px",
                  color: "#f5ee80",
                  letterSpacing: "0.1em",
                }}
              >
                #NoMusicOnADeadPlanet
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
