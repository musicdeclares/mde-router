import { supabaseAdmin } from "@/app/lib/supabase";
import { getCountryLabel } from "@/app/lib/countries";
import type { DirectoryOrganization } from "@/app/types/router";

interface OrgPublicView {
  id: string;
  org_name: string;
  country_code: string;
  website: string | null;
  logo: string | null;
  banner: string | null;
}

interface OrgProfile {
  org_id: string;
  org_name: string | null;
  tagline: string | null;
  cta_url: string | null;
  cta_text: string | null;
  fan_actions: string[] | null;
  description: string | null;
  image_url: string | null;
}

/**
 * Fetches organizations for the public directory.
 * Merges org_public_view (approved orgs) with router_org_profiles (custom overrides).
 */
export async function getOrganizations(): Promise<DirectoryOrganization[]> {
  // Fetch all approved orgs and all profiles in parallel
  const [orgsResult, profilesResult] = await Promise.all([
    supabaseAdmin
      .from("org_public_view")
      .select(
        "id, org_name, country_code, website, logo, banner"
      ),
    supabaseAdmin
      .from("router_org_profiles")
      .select(
        "org_id, org_name, tagline, cta_url, cta_text, fan_actions, description, image_url"
      ),
  ]);

  if (orgsResult.error) {
    console.error("Failed to fetch organizations:", orgsResult.error);
    throw new Error("Failed to load organizations");
  }

  // Profiles query may fail if table is empty — treat as empty array
  const profiles: OrgProfile[] = (profilesResult.data as OrgProfile[]) || [];
  const profileMap = new Map<string, OrgProfile>();
  for (const profile of profiles) {
    profileMap.set(profile.org_id, profile);
  }

  const organizations: DirectoryOrganization[] = (
    orgsResult.data as OrgPublicView[]
  )
    .filter((org) => {
      const profile = profileMap.get(org.id);
      return !!profile?.tagline;
    })
    .map((org) => {
      const profile = profileMap.get(org.id)!;

      return {
        id: org.id,
        name: profile.org_name || org.org_name,
        country: getCountryLabel(org.country_code),
        countryCode: org.country_code,
        tagline: profile.tagline!,
        fanActions: profile.fan_actions || [],
        website: org.website || "",
        ctaUrl: profile.cta_url || org.website || "",
        ctaText: profile.cta_text || "", // Default applied in component for i18n
        imageUrl: profile.image_url || org.banner || org.logo || "",
        description: profile.description || "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return organizations;
}
