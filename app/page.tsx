import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { EVENTS } from "@/app/lib/analytics-events";

export const metadata: Metadata = {
  title: "AMPLIFY by Music Declares Emergency",
  description:
    "Turn fan attention into real-world climate action, online and at shows.",
};

const mailtoHref = `mailto:hellous@musicdeclares.net?subject=${encodeURIComponent("Request to join AMPLIFY")}&body=${encodeURIComponent("Hi, MDE team:\n\n[artist name] is interested in joining AMPLIFY. A bit about us:\n- Upcoming shows/tour: \n- Social following/reach: \n\nLooking forward to connecting.\n[your name]")}`;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-amplify.png"
                alt=""
                width={500}
                height={396}
                priority
                style={{ width: 60, height: "auto" }}
              />
              <span className="text-xl font-bold">MDE AMPLIFY</span>
            </div>
            <Link
              href="/directory"
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Browse partner organizations
            </Link>
          </div>
        </div>
      </header>

      <main className="grow">
        {/* Hero */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              Turn fan attention into real-world climate action
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
              AMPLIFY helps artists mobilize their fans to support trusted
              climate organizations at shows, online, and on tour. Get simple,
              ready-to-use tools to take action in minutes.
            </p>
            <Button asChild size="lg" className="mb-12">
              <a
                href={mailtoHref}
                data-umami-event={EVENTS.HOME_CTA_EMAIL}
              >
                Get in touch
                <Mail className="ml-2 size-4" />
              </a>
            </Button>
            <p className="text-lg text-muted-foreground">
              One 25-show arena tour. 35,000+ fan actions. 13.5% conversion rate.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">How it works</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <span className="text-2xl font-bold text-muted-foreground w-8 shrink-0">
                  1
                </span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Use your AMPLIFY link
                  </h3>
                  <p className="text-muted-foreground">
                    Your link automatically routes fans to vetted climate
                    organizations based on where they are.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-2xl font-bold text-muted-foreground w-8 shrink-0">
                  2
                </span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Share it anywhere
                  </h3>
                  <p className="text-muted-foreground">
                    Social, email, link in bio, QR code at shows, on-screen
                    visuals—use it wherever your fans connect with you.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-2xl font-bold text-muted-foreground w-8 shrink-0">
                  3
                </span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Fans take action
                  </h3>
                  <p className="text-muted-foreground">
                    Every scan or click connects your fans with trusted
                    organizations doing real climate work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What MDE provides */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">What MDE provides</h2>
            <p className="text-muted-foreground mb-10">
              We want to make it as easy as possible for you to turn your fans
              into a force for change—without adding anything to your plate.
            </p>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Your custom QR code &amp; link
                </h3>
                <p className="text-muted-foreground">
                  Drop it into your social posts, show posters, or anywhere your
                  fans connect with you. Every scan sends them straight to
                  volunteer opportunities with our AMPLIFY partners.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  A one-pager for your merch table
                </h3>
                <p className="text-muted-foreground">
                  Just print it and set it out. Fans who want to learn more can
                  grab it while they&apos;re browsing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  A pre-show video with your QR code
                </h3>
                <p className="text-muted-foreground">
                  For venues with screens, this is one of our most powerful
                  tools. Ask the venue to play it before your set—in our pilot,
                  it drove a 13.5% conversion rate in one arena tour. If your venue can&apos;t
                  accommodate it, the QR code and one-pager still do the job.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Browse orgs CTA */}
        <section className="py-16 bg-mde-yellow/20 border-y border-mde-yellow">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold mb-1">
                  See who your fans will be supporting
                </h2>
                <p className="text-muted-foreground">
                  Browse our vetted partner organizations doing real climate
                  work around the world.
                </p>
              </div>
              <Button asChild variant="outline" size="lg" className="shrink-0">
                <Link
                  href="/directory"
                  data-umami-event={EVENTS.HOME_CTA_DIRECTORY}
                >
                  Browse partner organizations
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-muted-foreground">
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
        </div>
      </footer>
    </div>
  );
}
