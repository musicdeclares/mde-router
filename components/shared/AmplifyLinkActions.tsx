"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, QrCode, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QrCodeDialog } from "@/components/shared/QrCodeDialog";
import { AnalyticsEvent } from "@/app/lib/analytics-events";

interface AmplifyLinkActionsProps {
  artistHandle: string;
  artistName: string;
  events: {
    copyLink: AnalyticsEvent;
    openQrDialog: AnalyticsEvent;
    viewKit: AnalyticsEvent;
  };
}

function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function AmplifyLinkActions({
  artistHandle,
  artistName,
  events,
}: AmplifyLinkActionsProps) {
  const [copied, setCopied] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const amplifyUrl = `${getSiteUrl()}/a/${artistHandle}`;

  function copyLink() {
    navigator.clipboard.writeText(amplifyUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-muted px-3 py-2 rounded text-sm break-all">
            {amplifyUrl}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={copyLink}
            data-umami-event={events.copyLink}
            data-umami-event-artist={artistHandle}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => setQrDialogOpen(true)}
            data-umami-event={events.openQrDialog}
            data-umami-event-artist={artistHandle}
          >
            <QrCode className="h-4 w-4 mr-2" />
            QR Code
          </Button>
          <Button variant="outline" asChild>
            <Link
              href={`/kit/${artistHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event={events.viewKit}
              data-umami-event-artist={artistHandle}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Starter Kit
            </Link>
          </Button>
        </div>
      </div>

      <QrCodeDialog
        artistHandle={artistHandle}
        artistName={artistName}
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
      />
    </>
  );
}
