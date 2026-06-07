import { Metadata } from "next";
import { Anton, Courier_Prime, Bebas_Neue } from "next/font/google";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/app/lib/supabase";
import { ArtistFlyer } from "@/components/shared/ArtistFlyer";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier-prime",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function getArtist(handle: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = (await (supabaseAdmin.from("router_artists") as any)
    .select("id, handle, name, account_active, flyer_quote")
    .eq("handle", handle)
    .eq("account_active", true)
    .single()) as {
    data: {
      id: string;
      handle: string;
      name: string;
      account_active: boolean;
      flyer_quote: string | null;
    } | null;
  };
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const artist = await getArtist(handle);

  if (!artist) return { title: "AMPLIFY Flyer" };

  return {
    title: `${artist.name} | AMPLIFY Flyer`,
    description: `Print a flyer for ${artist.name}'s AMPLIFY campaign.`,
    robots: { index: false },
  };
}

export default async function FlyerPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const artist = await getArtist(handle);

  if (!artist) notFound();

  const amplifyUrl = `${getSiteUrl()}/a/${artist.handle}`;

  return (
    <>
      {/* Scoped print styles — these only render when this page is mounted */}
      <style>{`
        @media print {
          @page { size: 8.5in 11in; margin: 0; }
          #flyer-outer { background: none !important; padding: 0 !important; min-height: auto !important; }
          #flyer-canvas { box-shadow: none !important; transform: none !important; }
          #flyer-print-btn { display: none !important; }
        }
      `}</style>

      <div className={`${anton.variable} ${courierPrime.variable} ${bebasNeue.variable}`}>
        <ArtistFlyer
          artistName={artist.name}
          artistHandle={artist.handle}
          amplifyUrl={amplifyUrl}
          flyerQuote={artist.flyer_quote}
        />
      </div>
    </>
  );
}
