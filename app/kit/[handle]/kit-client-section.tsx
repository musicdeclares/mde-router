"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check, QrCode, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QrCodeDialog } from "@/components/shared/QrCodeDialog";
import { EVENTS } from "@/app/lib/analytics-events";
import { copyToClipboard } from "@/app/lib/clipboard";
import type { KitOrg } from "./page";

function getSampleCaptions(artistName: string, url: string) {
  return [
    {
      label: "Short",
      platform: "X / Twitter",
      text: `I’m joining @musicdeclares to connect fans with local climate orgs doing real work. Tap the link to find one near you: ${url} #AMPLIFY #NoMusicOnADeadPlanet`,
    },
    {
      label: "Medium",
      platform: "Instagram, Facebook, Text",
      text: `I’m part of the AMPLIFY program with @musicdeclares — connecting fans with vetted, grassroots climate organizations wherever you are. Click the link to find one in your country and get involved: ${url}`,
    },
    {
      label: "Long",
      platform: "Email newsletter",
      text: `I wanted to share something I’m genuinely excited about. I’ve joined Music Declares Emergency’s AMPLIFY program, which connects fans with vetted, grassroots climate organizations — locally, wherever you are in the world. Every time you click this link, you’ll be matched with a group already doing real work in your country that needs support. No big ask, no pressure — just a simple way to plug in if you want to. Here’s the link: ${url}`,
    },
  ];
}

interface KitClientSectionProps {
  amplifyUrl: string;
  artistHandle: string;
  artistName: string;
  kitOrgs: KitOrg[];
}

export function KitClientSection({
  amplifyUrl,
  artistHandle,
  artistName,
  kitOrgs,
}: KitClientSectionProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState<number | null>(null);
  const [copiedOrgDesc, setCopiedOrgDesc] = useState<number | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [printQrEl, setPrintQrEl] = useState<HTMLDivElement | null>(null);

  const captions = getSampleCaptions(artistName, amplifyUrl);

  const printQrRef = useCallback((node: HTMLDivElement | null) => {
    setPrintQrEl(node);
  }, []);

  // Render a static QR code for print (hidden on screen)
  useEffect(() => {
    if (!printQrEl) return;

    let cancelled = false;

    import("qr-code-styling").then((mod) => {
      if (cancelled) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const QRCodeStyling = (mod as any).default ?? mod;

      printQrEl.innerHTML = "";

      const qr = new QRCodeStyling({
        type: "canvas",
        width: 600,
        height: 600,
        data: amplifyUrl,
        image: "/logo-mde.png",
        qrOptions: { errorCorrectionLevel: "H" as const },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.35,
          margin: 8,
          crossOrigin: "anonymous",
        },
        dotsOptions: { type: "rounded" as const, color: "#000000" },
        cornersSquareOptions: {
          type: "extra-rounded" as const,
          color: "#000000",
        },
        cornersDotOptions: { type: "dot" as const, color: "#000000" },
        backgroundOptions: { color: "#ffffff" },
      });

      qr.append(printQrEl);
    });

    return () => {
      cancelled = true;
    };
  }, [printQrEl, amplifyUrl]);

  function handleCopy() {
    copyToClipboard(amplifyUrl);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyCaption(index: number, text: string) {
    copyToClipboard(text);
    setCopiedCaption(index);
    toast.success("Caption copied");
    setTimeout(() => setCopiedCaption(null), 2000);
  }

  function handleCopyOrgDesc(index: number, text: string) {
    copyToClipboard(text);
    setCopiedOrgDesc(index);
    toast.success("Description copied");
    setTimeout(() => setCopiedOrgDesc(null), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Link display */}
      <div className="flex items-center gap-2 bg-muted rounded-lg p-4 print:p-2">
        <code className="flex-1 text-sm sm:text-base font-mono break-all print:text-xs">
          {amplifyUrl}
        </code>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="shrink-0 print:hidden"
          data-umami-event={EVENTS.KIT_COPY_LINK}
          data-umami-event-artist={artistHandle}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">
            {copied ? "Copied" : "Copy"}
          </span>
        </Button>
      </div>

      {/* QR code button (screen only) */}
      <Button
        variant="outline"
        className="w-full print:hidden"
        onClick={() => setQrOpen(true)}
        data-umami-event={EVENTS.KIT_OPEN_QR_DIALOG}
        data-umami-event-artist={artistHandle}
      >
        <QrCode className="h-4 w-4 mr-2" />
        Download QR Code
      </Button>

      {/* Static QR code (print only) — rendered at 600px, displayed at 200px for sharp print */}
      <div className="hidden print:flex print:justify-center print:py-2 [&_canvas]:w-50 [&_canvas]:h-50">
        <div ref={printQrRef} />
      </div>

      <QrCodeDialog
        open={qrOpen}
        onOpenChange={setQrOpen}
        artistHandle={artistHandle}
        artistName={artistName}
      />

      {/* Organization descriptions */}
      {kitOrgs.length > 0 && (
        <div className="space-y-3 pt-6 print:hidden">
          <h2 className="text-xl font-semibold">
            About your climate action{" "}
            {kitOrgs.length === 1 ? "organization" : "organizations"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Descriptions provided by each organization. Use as a starting point
            when posting about them: paraphrase freely.
          </p>
          <div className="space-y-3">
            {kitOrgs.map((org, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{org.name}</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                      <MapPin className="size-3" />
                      {org.country}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyOrgDesc(index, org.description)}
                    className="shrink-0"
                    data-umami-event={EVENTS.KIT_COPY_CAPTION}
                    data-umami-event-artist={artistHandle}
                    data-umami-event-caption={org.name}
                  >
                    {copiedOrgDesc === index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="ml-2">
                      {copiedOrgDesc === index ? "Copied" : "Copy"}
                    </span>
                  </Button>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {org.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample captions */}
      <div className="space-y-3 pt-6 print:hidden">
        <h2 className="text-xl font-semibold">Sample captions</h2>
        <p className="text-sm text-muted-foreground">
          Ready-to-use text for social media posts and email newsletters. Copy and customize as
          needed.
        </p>
        <div className="space-y-3">
          {captions.map((caption, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{caption.label}</span>
                  <span className="block text-xs text-muted-foreground">{caption.platform}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCaption(index, caption.text)}
                  className="shrink-0"
                  data-umami-event={EVENTS.KIT_COPY_CAPTION}
                  data-umami-event-artist={artistHandle}
                  data-umami-event-caption={caption.label}
                >
                  {copiedCaption === index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-2">
                    {copiedCaption === index ? "Copied" : "Copy"}
                  </span>
                </Button>
              </div>
              <p className="text-sm leading-relaxed">{caption.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
