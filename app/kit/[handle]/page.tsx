import { Metadata } from "next";
import Image from "next/image";
import { supabaseAdmin } from "@/app/lib/supabase";
import { getCountryLabel } from "@/app/lib/countries";
import { KitClientSection } from "./kit-client-section";

export interface KitOrg {
  name: string;
  country: string;
  description: string;
}

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function getArtist(handle: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = (await (supabaseAdmin.from("router_artists") as any)
    .select("id, handle, name, account_active")
    .eq("handle", handle)
    .eq("account_active", true)
    .single()) as {
    data: {
      id: string;
      handle: string;
      name: string;
      account_active: boolean;
    } | null;
  };
  return data;
}

/**
 * Get organizations associated with the artist's active or upcoming tour,
 * filtered to those that have an description in their profile.
 */
async function getKitOrgs(artistId: string): Promise<KitOrg[]> {
  // Find active or upcoming tour (considering pre/post windows)
  const now = new Date();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tours } = (await (supabaseAdmin.from("router_tours") as any)
    .select(
      "id, start_date, end_date, pre_tour_window_days, post_tour_window_days",
    )
    .eq("artist_id", artistId)
    .eq("enabled", true)
    .order("start_date", { ascending: true })) as {
    data:
      | {
          id: string;
          start_date: string;
          end_date: string;
          pre_tour_window_days: number;
          post_tour_window_days: number;
        }[]
      | null;
  };

  if (!tours || tours.length === 0) return [];

  // Find the active tour (within effective window) or next upcoming
  const activeTour = tours.find((tour) => {
    const effectiveStart = new Date(tour.start_date);
    effectiveStart.setDate(
      effectiveStart.getDate() - (tour.pre_tour_window_days || 0),
    );
    const effectiveEnd = new Date(tour.end_date);
    effectiveEnd.setDate(
      effectiveEnd.getDate() + (tour.post_tour_window_days || 0),
    );
    return now >= effectiveStart && now <= effectiveEnd;
  });

  const upcomingTour = !activeTour
    ? tours.find((tour) => new Date(tour.start_date) > now)
    : null;

  const tour = activeTour || upcomingTour;
  if (!tour) return [];

  // Get tour overrides (artist-selected orgs per country)
  const { data: overrides } = (await supabaseAdmin
    .from("router_tour_overrides")
    .select("org_id, country_code")
    .eq("tour_id", tour.id)
    .eq("enabled", true)) as unknown as {
    data: { org_id: string | null; country_code: string }[] | null;
  };

  const overrideCountries = new Set(
    (overrides || []).map((o) => o.country_code),
  );
  const orgIds = new Set((overrides || []).map((o) => o.org_id));

  // Get country defaults for countries without overrides
  const { data: defaults } = (await supabaseAdmin
    .from("router_country_defaults")
    .select("org_id, country_code")) as unknown as {
    data: { org_id: string; country_code: string }[] | null;
  };

  if (defaults) {
    for (const d of defaults) {
      if (!overrideCountries.has(d.country_code)) {
        orgIds.add(d.org_id);
      }
    }
  }

  if (orgIds.size === 0) return [];

  // Get org profiles with descriptions
  const { data: profiles } = (await supabaseAdmin
    .from("router_org_profiles")
    .select("org_id, org_name, description")
    .in("org_id", Array.from(orgIds))
    .not("description", "is", null)) as unknown as {
    data: { org_id: string; org_name: string | null; description: string | null }[] | null;
  };

  if (!profiles || profiles.length === 0) return [];

  // Get org names from org_public_view for fallback
  const profileOrgIds = profiles.map((p) => p.org_id);
  const { data: orgs } = await supabaseAdmin
    .from("org_public_view")
    .select("id, org_name, country_code")
    .in("id", profileOrgIds);

  const orgMap = new Map(
    (orgs || []).map(
      (o: { id: string; org_name: string; country_code: string }) => [o.id, o],
    ),
  );

  return profiles
    .map((profile) => {
      const org = orgMap.get(profile.org_id);
      if (!org) return null;
      return {
        name: profile.org_name || org.org_name,
        country: getCountryLabel(org.country_code),
        description: profile.description!,
      };
    })
    .filter((o): o is KitOrg => o !== null);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const artist = await getArtist(handle);

  if (!artist) {
    return { title: "AMPLIFY Toolkit" };
  }

  return {
    title: `${artist.name} | AMPLIFY Toolkit`,
    description: `${artist.name}'s AMPLIFY link — directing fans to climate action.`,
  };
}

export default async function KitPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const artist = await getArtist(handle);

  if (!artist) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-8">
        <Image
          src="/logo-amplify.png"
          alt=""
          width={500}
          height={396}
          className="w-20 h-auto mb-4"
        />
        <p className="text-sm text-muted-foreground mb-8">Toolkit</p>

        <h1 className="text-2xl font-bold mb-4">Page not found</h1>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          We couldn&apos;t find a page for this link. If you received it from
          Music Declares Emergency, please check the details with them.
        </p>
        <a
          href="https://www.musicdeclares.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground text-muted-foreground"
        >
          Visit musicdeclares.net
        </a>
      </main>
    );
  }

  const amplifyUrl = `${getSiteUrl()}/a/${artist.handle}`;
  const kitOrgs = await getKitOrgs(artist.id);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-8 print:p-0 print:min-h-0">
      <div className="w-full max-w-2xl space-y-10 print:space-y-4">
        {/* Header */}
        <div className="flex flex-col items-center text-center pt-8 print:pt-2">
          <Image
            src="/logo-amplify.png"
            alt=""
            width={500}
            height={396}
            className="w-20 h-auto mb-4 print:w-12 print:mb-2"
          />

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 print:text-2xl print:mb-1">
            {artist.name}&apos;s Climate Action Link
          </h1>
          <p className="text-muted-foreground max-w-lg print:text-sm">
            One link that connects fans to a vetted climate action organization
            so they can get involved locally.
          </p>
        </div>

        {/* How your link works */}
        <section className="space-y-4 print:space-y-1">
          <h2 className="text-xl font-semibold print:text-base">
            How your link works
          </h2>
          <p className="text-muted-foreground leading-relaxed print:text-xs print:leading-normal">
            Fans are directed to a vetted, grassroots climate org based on their
            location and {artist.name}&apos;s tour dates. MDE pre-screens every
            organization. The link is evergreen: it never breaks, even between
            tours.
          </p>
        </section>

        {/* Interactive section: link + QR */}
        <KitClientSection
          amplifyUrl={amplifyUrl}
          artistHandle={artist.handle}
          artistName={artist.name}
          kitOrgs={kitOrgs}
        />

        {/* Where to share your link */}
        <section className="space-y-4 print:space-y-2">
          <h2 className="text-xl font-semibold print:text-base">
            Where to share your link
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 print:gap-1.5 print:grid-cols-2">
            {[
              {
                title: "Social bios & profiles",
                description:
                  "Add your link to Instagram, TikTok, FB, X, Linktree, or any bio page. Pair with your tour dates for context.",
              },
              {
                title: "Social media posts",
                description:
                  "Share your link in tour-related posts, stories, or video descriptions.",
              },
              {
                title: "Physical banners, flyers, & merch tables",
                description:
                  "Print your QR code on physical tour materials. It scans reliably at any size.",
              },
              {
                title: "Stage & venue",
                description:
                  "Display your QR code on screens during shows, stage banners, or barricade signage for fans to scan live.",
              },
              {
                title: "Email newsletters & texts to fans",
                description:
                  "Include your link in fan newsletters, show announcements, and mailing list updates.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="border rounded-lg p-4 space-y-1 print:p-2 print:space-y-0"
              >
                <p className="font-medium print:text-sm">{item.title}</p>
                <p className="text-sm text-muted-foreground print:text-xs">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pb-8 print:pb-0 print:text-xs">
          <p>
            Part of the{" "}
            <a
              href="https://www.musicdeclares.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Music Declares Emergency
            </a>{" "}
            initiative
          </p>
          <p className="mt-1 text-xs print:text-[10px]">
            No music on a dead planet.
          </p>
        </footer>
      </div>
    </main>
  );
}
