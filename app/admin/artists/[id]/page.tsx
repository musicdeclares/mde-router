"use client";

import { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Artist, Tour } from "@/app/types/router";
import { TourTable, TourWithArtist } from "@/components/tours/TourTable";
import { AmplifyLinkActions } from "@/components/shared/AmplifyLinkActions";
import { useUnsavedChanges } from "@/app/lib/hooks/use-unsaved-changes";
import { UnsavedChangesIndicator } from "@/components/shared/UnsavedChangesIndicator";
import { EVENTS } from "@/app/lib/analytics-events";

interface ArtistWithTours extends Artist {
  router_tours: Tour[];
}

export default function EditArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [artist, setArtist] = useState<ArtistWithTours | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [accountActive, setAccountActive] = useState(true);
  const [accountInactiveReason, setAccountInactiveReason] = useState("");

  // Unsaved changes tracking
  const initialValues = useMemo(
    () => ({
      name: artist?.name ?? "",
      accountActive: artist?.account_active ?? true,
      accountInactiveReason: artist?.account_inactive_reason ?? "",
    }),
    [artist],
  );
  const currentValues = useMemo(
    () => ({ name, accountActive, accountInactiveReason }),
    [name, accountActive, accountInactiveReason],
  );
  const { hasUnsavedChanges, savedAt, markSaved } = useUnsavedChanges(
    initialValues,
    currentValues,
  );

  useEffect(() => {
    fetchArtist();
  }, [id]);

  async function fetchArtist() {
    setLoading(true);
    try {
      const res = await fetch(`/api/artists/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          router.push("/admin/artists");
          return;
        }
        throw new Error("Failed to fetch");
      }
      const data = await res.json();
      setArtist(data.artist);
      setName(data.artist.name);
      setAccountActive(data.artist.account_active ?? true);
      setAccountInactiveReason(data.artist.account_inactive_reason ?? "");
    } catch (error) {
      console.error("Error fetching artist:", error);
      toast.error("Failed to load artist");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/artists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          account_active: accountActive,
          account_inactive_reason: accountActive
            ? null
            : accountInactiveReason.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update");
        setSaving(false);
        return;
      }

      setArtist((prev) => (prev ? { ...prev, ...data.artist } : null));
      markSaved();
      toast.success("Artist updated");
    } catch (error) {
      console.error("Error updating artist:", error);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  }

  const toursWithArtist: TourWithArtist[] = useMemo(() => {
    if (!artist) return [];
    return (artist.router_tours || []).map((tour) => ({
      ...tour,
      router_artists: {
        id: artist.id,
        handle: artist.handle,
        name: artist.name,
      },
    }));
  }, [artist]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!artist) {
    return null;
  }

  const tours = artist.router_tours || [];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Link
          href="/admin/artists"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Artists
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Artist Details */}
          <Card>
            <CardHeader>
              <CardTitle>Artist Details</CardTitle>
              <CardDescription>Update artist information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Artist Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label>Handle</Label>
                <code className="block bg-muted px-3 py-2 rounded text-sm">
                  {artist.handle}
                </code>
                <p className="text-sm text-muted-foreground">
                  The handle portion of this link cannot be changed after
                  creation.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="account-active">Account Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {accountActive
                        ? "Account is active"
                        : "Account is inactive"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${accountActive ? "text-muted-foreground" : "font-medium"}`}
                    >
                      Inactive
                    </span>
                    <Switch
                      id="account-active"
                      checked={accountActive}
                      onCheckedChange={setAccountActive}
                      disabled={saving}
                    />
                    <span
                      className={`text-sm ${accountActive ? "font-medium" : "text-muted-foreground"}`}
                    >
                      Active
                    </span>
                  </div>
                </div>
                {!accountActive && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      The artist cannot reactivate their own account. Only use
                      this to deactivate an artist partnership.
                    </p>
                    <Textarea
                      placeholder="Reason for deactivation (optional, internal use only)"
                      value={accountInactiveReason}
                      onChange={(e) => setAccountInactiveReason(e.target.value)}
                      disabled={saving}
                      rows={2}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  data-umami-event={EVENTS.ADMIN_SAVE_ARTIST}
                  data-umami-event-artist={artist.handle}
                  data-umami-event-account-active={accountActive ? "true" : "false"}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <UnsavedChangesIndicator
                  hasUnsavedChanges={hasUnsavedChanges}
                  savedAt={savedAt}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tours */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Tours
                    {tours.length > 0 && (
                      <span className="text-muted-foreground font-normal ml-1.5">
                        ({tours.length})
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Tours associated with this artist
                  </CardDescription>
                </div>
                <Button size="sm" asChild>
                  <Link href={`/admin/tours/new?artist=${id}`}>Add Tour</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tours.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tours added yet.</p>
                  <Button variant="link" asChild>
                    <Link href={`/admin/tours/new?artist=${id}`}>Add Tour</Link>
                  </Button>
                </div>
              ) : (
                <TourTable tours={toursWithArtist} />
              )}
            </CardContent>
          </Card>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Artist AMPLIFY Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <AmplifyLinkActions
                artistHandle={artist.handle}
                artistName={artist.name}
                events={{
                  copyLink: EVENTS.ADMIN_COPY_LINK,
                  openQrDialog: EVENTS.ADMIN_OPEN_QR_DIALOG,
                  viewKit: EVENTS.ADMIN_VIEW_KIT,
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Added {new Date(artist.created_at).toLocaleDateString()} · Last
        updated {new Date(artist.updated_at).toLocaleDateString()}
      </p>
    </div>
  );
}
