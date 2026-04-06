-- Rename mission to tagline in router_org_profiles
-- "mission" was ambiguous (orgs have missions); "tagline" better communicates
-- that this is a short directory teaser, distinct from the longer description field.
ALTER TABLE router_org_profiles RENAME COLUMN mission TO tagline;

-- Add description field to router_org_profiles
-- A 1-2 paragraph description provided by each org for artists to reference
-- when talking about the organization (distinct from the short directory tagline)
ALTER TABLE router_org_profiles ADD COLUMN IF NOT EXISTS description text;
