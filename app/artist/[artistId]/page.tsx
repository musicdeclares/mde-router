"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Plus, Pause, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AmplifyLinkActions } from "@/components/shared/AmplifyLinkActions";
import { Artist, Tour } from "@/app/types/router";
import { EVENTS, SOURCES } from "@/app/lib/analytics-events";

interface ArtistWithTours extends Artist {
  router_tours: Tour[];
}

interface AnalyticsData {
  totalRoutes: number;
  successfulRoutes: number;
  fallbackRoutes: number;
  topCountries: { country_code: string; count: number }[];
}

export default function ArtistDashboardPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = use(params);
  const [artist, setArtist] = useState<ArtistWithTours | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch artist data
        const artistRes = await fetch(`/api/artists/${artistId}`);
        if (artistRes.ok) {
          const artistData = await artistRes.json();
          setArtist(artistData.artist);
        }

        // Fetch analytics (7 days)
        const analyticsRes = await fetch(
          `/api/analytics/artist/${artistId}?days=7`,
        );
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setAnalytics(analyticsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [artistId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Artist not found</p>
      </div>
    );
  }

  const activeTour = artist.router_tours?.find((tour) => {
    const now = new Date();
    const startDate = new Date(tour.start_date);
    const endDate = new Date(tour.end_date);
    return tour.enabled && now >= startDate && now <= endDate;
  });
  const upcomingTour = artist.router_tours?.find((tour) => {
    const now = new Date();
    const startDate = new Date(tour.start_date);
    return tour.enabled && startDate > now;
  });

  const showTopCountries =
    analytics && analytics.topCountries && analytics.topCountries.length > 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{artist.name}</h1>
        <p className="text-muted-foreground mt-1">Your AMPLIFY dashboard</p>
      </div>

      {!artist.account_active && (
        <Alert
          variant="destructive"
          className="border-destructive/50 bg-destructive/10"
        >
          <Ban className="h-4 w-4" />
          <AlertDescription>
            Your AMPLIFY account has been deactivated. Please contact Music
            Declares Emergency for assistance.
          </AlertDescription>
        </Alert>
      )}

      {artist.account_active && !artist.link_active && (
        <Alert
          variant="destructive"
          className="border-destructive/50 bg-destructive/10"
        >
          <Pause className="h-4 w-4" />
          <AlertDescription>
            Your AMPLIFY link is currently paused. Fans will see a fallback page
            instead of being routed to organizations.
            {artist.link_inactive_reason && (
              <span className="block mt-1 text-sm">
                Reason: {artist.link_inactive_reason}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AMPLIFY Link Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your AMPLIFY Link</CardTitle>
            <CardDescription>
              Share this link anywhere to direct fans to climate action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AmplifyLinkActions
              artistHandle={artist.handle}
              artistName={artist.name}
              events={{
                copyLink: EVENTS.ARTIST_COPY_LINK,
                openQrDialog: EVENTS.ARTIST_OPEN_QR_DIALOG,
                viewKit: EVENTS.ARTIST_VIEW_KIT,
              }}
            />
          </CardContent>
        </Card>

        {/* Active/Upcoming Tour Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTour
                ? "Active Tour"
                : upcomingTour
                  ? "Upcoming Tour"
                  : "Tours"}
            </CardTitle>
            <CardDescription>
              {activeTour
                ? "Currently routing fans based on this tour"
                : upcomingTour
                  ? "Your next scheduled tour"
                  : "No active or upcoming tours"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTour ? (
              <div className="space-y-2">
                <p className="font-medium">{activeTour.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(activeTour.start_date).toLocaleDateString()} –{" "}
                  {new Date(activeTour.end_date).toLocaleDateString()}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/artist/${artistId}/tours/${activeTour.id}`}
                    data-umami-event={EVENTS.ARTIST_EDIT_TOUR}
                    data-umami-event-artist={artist.handle}
                    data-umami-event-tour={activeTour.name}
                  >
                    Manage Tour
                  </Link>
                </Button>
              </div>
            ) : upcomingTour ? (
              <div className="space-y-2">
                <p className="font-medium">{upcomingTour.name}</p>
                <p className="text-sm text-muted-foreground">
                  Starts{" "}
                  {new Date(upcomingTour.start_date).toLocaleDateString()}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/artist/${artistId}/tours/${upcomingTour.id}`}
                    data-umami-event={EVENTS.ARTIST_EDIT_TOUR}
                    data-umami-event-artist={artist.handle}
                    data-umami-event-tour={upcomingTour.name}
                  >
                    Manage Tour
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm mb-4">
                  Add a tour to start routing fans to climate action orgs
                </p>
                <Button asChild>
                  <Link
                    href={`/artist/${artistId}/tours/new`}
                    data-umami-event={EVENTS.ARTIST_CREATE_TOUR}
                    data-umami-event-artist={artist.handle}
                    data-umami-event-source={SOURCES.DASHBOARD}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tour
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {analytics && analytics.totalRoutes > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Last 7 Days</CardTitle>
              <CardDescription>
                How your AMPLIFY link is performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{analytics.totalRoutes}</p>
                  <p className="text-xs text-muted-foreground">Total Routes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics.successfulRoutes}
                  </p>
                  <p className="text-xs text-muted-foreground">To Orgs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {analytics.fallbackRoutes}
                  </p>
                  <p className="text-xs text-muted-foreground">Fallback</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Countries - only if multiple countries */}
        {showTopCountries && (
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Where your fans are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.topCountries.slice(0, 5).map((country) => (
                  <div
                    key={country.country_code}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium">{country.country_code}</span>
                    <span className="text-muted-foreground">
                      {country.count} routes
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
