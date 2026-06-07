-- Add flyer_quote to router_artists for artist-authored endorsement text on the printable flyer
ALTER TABLE router_artists
  ADD COLUMN flyer_quote varchar(280);
