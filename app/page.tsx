import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Mail } from "lucide-react";
import { EVENTS } from "@/app/lib/analytics-events";

export const metadata: Metadata = {
  title: "AMPLIFY by Music Declares Emergency",
  description:
    "Turn fan attention into real-world climate action, online and at shows.",
};

const mailtoHref = `mailto:hellous@musicdeclares.net?subject=${encodeURIComponent("Request to join AMPLIFY")}&body=${encodeURIComponent("Hi, MDE team:\n\n[artist name] is interested in joining AMPLIFY. A bit about us:\n- Upcoming shows/tour: \n- Social following/reach: \n\nLooking forward to connecting.\n[your name]")}`;

const valueProps = [
  {
    label: "Deepens fan engagement",
    description: "Converts listeners into community",
  },
  {
    label: "Minimal workload",
    description: "We handle everything; you just share",
  },
  {
    label: "Works everywhere",
    description: "Tour, social, email, all in one link",
  },
  {
    label: "Geolocation routing",
    description: "Fans auto-directed to local orgs in their country",
  },
  {
    label: "Strengthens your brand",
    description: "Matches fan demand for artist activism",
  },
  {
    label: "Long-term partnership",
    description: "Sustained infrastructure for climate action",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-mde.png"
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
            <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              One link. Minimal lift.
            </p>
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
            <div className="space-y-1">
              <p className="text-lg text-muted-foreground">
                One 25-show arena tour. 34,000+ fan actions. 13.5% conversion
                rate.
              </p>
              <p className="text-sm text-muted-foreground">
                4,100+ signed artists &middot; Global network &middot; Est. 2019
              </p>
            </div>
          </div>
        </section>

        {/* Why it works */}
        <section className="py-16 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Why it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {valueProps.map(({ label, description }) => (
                <div key={label} className="flex gap-3">
                  <Check className="size-5 shrink-0 mt-0.5 text-green-700" />
                  <p>
                    <span className="font-semibold">{label}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      — {description}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16">
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

        {/* What we handle / What you handle */}
        <section className="py-16 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">
              A clear division of effort
            </h2>
            <p className="text-muted-foreground mb-10">
              We want to make it as easy as possible for you to turn your fans
              into a force for change <em>without adding anything to your plate</em>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">We handle</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2.5">
                    <Check className="size-4 shrink-0 mt-0.5 text-green-700" />
                    Partner vetting
                  </li>
                  <li className="flex gap-2.5">
                    <Check className="size-4 shrink-0 mt-0.5 text-green-700" />
                    Core messaging
                  </li>
                  <li className="flex gap-2.5">
                    <Check className="size-4 shrink-0 mt-0.5 text-green-700" />
                    Link performance reporting
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">You handle</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2.5">
                    <span className="shrink-0 mt-0.5 w-4 text-center leading-none">
                      &middot;
                    </span>
                    Display QR code at shows (on-screen, merch table)
                  </li>
                  <li className="flex gap-2.5">
                    <span className="shrink-0 mt-0.5 w-4 text-center leading-none">
                      &middot;
                    </span>
                    Post link in socials (IG, TikTok, X)
                  </li>
                  <li className="flex gap-2.5">
                    <span className="shrink-0 mt-0.5 w-4 text-center leading-none">
                      &middot;
                    </span>
                    Share link in email newsletters
                  </li>
                </ul>
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

        {/* Bottom CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">
              Ready to activate your fans?
            </h2>
            <p className="text-muted-foreground mb-8">
              Get in touch, and we&apos;ll share your AMPLIFY toolkit with you: your unique
              AMPLIFY link, QR code assets, social templates, and a usage guide.
            </p>
            <Button asChild size="lg">
              <a href={mailtoHref} data-umami-event={EVENTS.HOME_CTA_EMAIL}>
                Get in touch
                <Mail className="ml-2 size-4" />
              </a>
            </Button>
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
          <p className="mt-2 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Music Declares Emergency. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
