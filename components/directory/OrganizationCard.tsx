"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Target,
  ExternalLink,
  CircleHelp,
  Copy,
  Check,
} from "lucide-react";
import { ImageWithFallback } from "@/components/directory/ImageWithFallback";
import type { DirectoryOrganization } from "@/app/types/router";
import { EVENTS } from "@/app/lib/analytics-events";
import { getDirectoryContent, type Locale } from "@/app/lib/directory-content";
import { copyToClipboard } from "@/app/lib/clipboard";
import { toast } from "sonner";

function appendUtmParams(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("utm_source", "mde_amplify_dir");
    parsed.searchParams.set("utm_medium", "referral");
    return parsed.toString();
  } catch {
    return url;
  }
}

interface OrganizationCardProps {
  organization: DirectoryOrganization;
  locale?: Locale;
}

export function OrganizationCard({ organization, locale = "en" }: OrganizationCardProps) {
  const content = getDirectoryContent(locale);
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  const [descCopied, setDescCopied] = useState(false);

  return (
    <>
      <Card className="overflow-hidden border-gray-200 bg-white">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {organization.imageUrl ? (
            <ImageWithFallback
              src={organization.imageUrl}
              alt={organization.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <img
                src="/logo.png"
                alt=""
                className="w-20 h-auto object-contain opacity-60"
              />
            </div>
          )}
        </div>
        <div className="p-6">
          {organization.website ? (
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-xl mb-2 hover:underline inline-block text-foreground"
            >
              {organization.name}
            </a>
          ) : (
            <span className="font-bold text-xl mb-2 inline-block text-foreground">
              {organization.name}
            </span>
          )}

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <MapPin className="size-4" />
            <span>{organization.country}</span>
          </div>

          {organization.tagline && (
            <div className="flex items-start gap-2 mb-3">
              <Target className="size-4 mt-0.5 shrink-0 text-mde-green" />
              <p className="text-sm text-muted-foreground line-clamp-3">
                {organization.tagline}
              </p>
              {organization.description && (
                <button
                  type="button"
                  onClick={() => setDescDialogOpen(true)}
                  className="shrink-0 mt-0.5 text-gray-400 hover:text-gray-600"
                  title={content.card.descriptionTooltip}
                  data-umami-event={EVENTS.DIRECTORY_OPEN_ORG_DESC_DIALOG}
                  data-umami-event-org={organization.name}
                >
                  <CircleHelp className="size-4" />
                </button>
              )}
            </div>
          )}

          {organization.fanActions.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                {content.card.fansCanLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {organization.fanActions.map((action, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-gray-300 text-muted-foreground"
                  >
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {organization.ctaUrl && (
            <Button
              asChild
              className="w-full font-semibold bg-mde-yellow text-mde-body hover:bg-mde-yellow/90 hover:shadow-md hover:scale-[1.02] transition-all"
            >
              <a
                href={appendUtmParams(organization.ctaUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
                data-umami-event={EVENTS.DIRECTORY_ORG_CTA}
                data-umami-event-org={organization.name}
                data-umami-event-country={organization.country}
              >
                {organization.ctaText || content.card.defaultCtaText}
                <ExternalLink className="size-4" />
              </a>
            </Button>
          )}
        </div>
      </Card>

      {organization.description && (
        <Dialog open={descDialogOpen} onOpenChange={setDescDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{organization.name}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {organization.description}
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  copyToClipboard(organization.description);
                  setDescCopied(true);
                  toast.success(content.card.descriptionCopied);
                  setTimeout(() => setDescCopied(false), 2000);
                }}
                data-umami-event={EVENTS.DIRECTORY_COPY_ORG_DESC}
                data-umami-event-org={organization.name}
              >
                {descCopied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {descCopied
                  ? content.card.descriptionCopied
                  : content.card.copyDescription}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
