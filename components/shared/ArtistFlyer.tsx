"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { EVENTS } from "@/app/lib/analytics-events";

interface ArtistFlyerProps {
  artistName: string;
  artistHandle: string;
  amplifyUrl: string;
  flyerQuote?: string | null;
}

export function ArtistFlyer({ artistName, artistHandle, amplifyUrl, flyerQuote }: ArtistFlyerProps) {
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

  const quoteText = flyerQuote?.trim() || null;

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
                padding: "14px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  color: "#ffffff",
                  fontFamily: "var(--font-courier-prime), monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  lineHeight: 1.4,
                }}
              >
                MUSIC DECLARES EMERGENCY
              </div>
            </div>

            {/* MAIN HEADLINE */}
            <div
              style={{
                padding: "20px 32px 0",
                flexShrink: 0,
              }}
            >
              {["NO MUSIC", "ON A DEAD", "PLANET."].map((line) => (
                <div
                  key={line}
                  style={{
                    fontFamily: "var(--font-bebas-neue), var(--font-anton), sans-serif",
                    fontSize: "116px",
                    lineHeight: 0.88,
                    color: "#000000",
                    display: "block",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.01em",
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* CTA STRIP */}
            <div
              style={{
                backgroundColor: "#1b4332",
                padding: "13px 32px",
                margin: "20px 0 0",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-bebas-neue), var(--font-anton), sans-serif",
                  fontSize: "22px",
                  color: "#ffffff",
                  letterSpacing: "0.05em",
                }}
              >
                Join thousands of fans already taking action
              </div>
            </div>

            {/* ACCENT RULE */}
            <div
              style={{
                height: "4px",
                backgroundColor: "#000000",
                margin: "0",
                flexShrink: 0,
              }}
            />

            {/* ARTIST QUOTE / FALLBACK */}
            <div
              style={{
                padding: "20px 32px 16px",
                flexShrink: 0,
              }}
            >
              {quoteText ? (
                <>
                  <p
                    style={{
                      fontFamily: "var(--font-courier-prime), monospace",
                      fontSize: "15px",
                      lineHeight: 1.7,
                      color: "#111111",
                      margin: "0 0 10px 0",
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{quoteText}&rdquo;
                  </p>
                  <div
                    style={{
                      fontFamily: "var(--font-anton), sans-serif",
                      fontSize: "16px",
                      color: "#000000",
                      letterSpacing: "0.06em",
                    }}
                  >
                    — {artistName.toUpperCase()}
                  </div>
                </>
              ) : (
                <>
                  <p
                    style={{
                      fontFamily: "var(--font-courier-prime), monospace",
                      fontSize: "15px",
                      lineHeight: 1.7,
                      color: "#111111",
                      margin: 0,
                    }}
                  >
                    {artistName}&nbsp;is directing fans to climate action through
                    Music Declares Emergency&rsquo;s AMPLIFY program, connecting you
                    with vetted, grassroots organizations wherever you are in
                    the world.
                  </p>
                </>
              )}
            </div>

            {/* QR CODE SECTION */}
            <div
              style={{
                backgroundColor: "#1b4332",
                margin: "0 32px",
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
                    Find a local climate org. Takes 30 seconds.
                  </div>
                </div>
              </div>
            </div>

            {/* STATS STRIP */}
            <div
              style={{
                margin: "0 32px",
                padding: "14px 20px",
                backgroundColor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
                {[
                  { num: "4,000+", label: "Artists Signed" },
                  { num: "2,000+", label: "Music Businesses" },
                  { num: "18,000+", label: "Fan Members" },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-anton), sans-serif",
                        fontSize: "22px",
                        color: "#000000",
                        lineHeight: 1,
                      }}
                    >
                      {stat.num}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-courier-prime), monospace",
                        fontSize: "8.5px",
                        color: "#555555",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        marginTop: "3px",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <Image
                src="/logo-mde.png"
                alt="Music Declares Emergency"
                width={80}
                height={63}
                style={{ display: "block", flexShrink: 0 }}
                unoptimized
              />
            </div>

            {/* FLEX SPACER */}
            <div style={{ flexGrow: 1 }} />

            {/* FOOTER */}
            <div
              style={{
                backgroundColor: "#000000",
                padding: "14px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-courier-prime), monospace",
                  fontSize: "12px",
                  color: "#f5ee80",
                  letterSpacing: "0.1em",
                  fontWeight: 700,
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
