export type Locale = "en" | "fr";

/** Available locales with display names */
export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

/** localStorage key for persisted locale preference */
export const LOCALE_STORAGE_KEY = "mde-amplify-locale";

/**
 * Detect locale from Accept-Language header.
 * Returns 'fr' if French is preferred, otherwise 'en'.
 */
export function detectLocaleFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "en";

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=");
      return {
        code: code.split("-")[0].toLowerCase(),
        q: qValue ? parseFloat(qValue) : 1.0,
      };
    })
    .sort((a, b) => b.q - a.q);

  const preferred = languages[0]?.code;
  return preferred === "fr" ? "fr" : "en";
}

export const directoryContent = {
  en: {
    meta: {
      title: "Climate Org Directory | MDE AMPLIFY",
      description:
        "Explore vetted climate action organizations partnering with Music Declares Emergency. Find grassroots groups making a difference in your country.",
      ogDescription:
        "Explore vetted climate action organizations partnering with Music Declares Emergency.",
    },
    header: {
      title: "MDE AMPLIFY",
      titleSuffix: "Climate Org Directory",
      subtitle:
        "Connecting music lovers with climate action organizations worldwide",
    },
    search: {
      placeholder: "Search organizations...",
      resultsCount: (showing: number, total: number) =>
        `Showing ${showing} of ${total} organizations`,
    },
    filters: {
      selectCountry: "Select Country",
      allCountries: "All Countries",
    },
    card: {
      fansCanLabel: "FANS CAN",
      defaultCtaText: "Get involved",
      descriptionTooltip: "In the org's words",
      copyDescription: "Copy",
      descriptionCopied: "Copied",
    },
    empty: {
      noResults: {
        title: "No organizations found",
        description: "Try adjusting your search or filters",
      },
      noData: {
        title: "No organizations available yet",
        description:
          "We're still building our network of climate action organizations. Check back soon!",
      },
      error: {
        title: "Something went wrong",
        description: "We couldn't load the organizations. Please try again.",
        retry: "Try again",
      },
    },
    footer: {
      partOf: "Part of the",
      mde: "Music Declares Emergency",
      initiative: "initiative",
      tagline: "No music on a dead planet.",
      copyright: "Music Declares Emergency. All rights reserved.",
    },
  },
  fr: {
    meta: {
      title: "Répertoire des organisations | MDE AMPLIFY",
      description:
        "Découvrez les organisations climatiques vérifiées partenaires de Music Declares Emergency. Trouvez des groupes locaux qui font la différence dans votre pays.",
      ogDescription:
        "Découvrez les organisations climatiques vérifiées partenaires de Music Declares Emergency.",
    },
    header: {
      title: "MDE AMPLIFY",
      titleSuffix: "Répertoire des organisations",
      subtitle:
        "Connecter les fans de musique aux organisations climatiques du monde entier",
    },
    search: {
      placeholder: "Rechercher des organisations...",
      resultsCount: (showing: number, total: number) =>
        `Affichage de ${showing} sur ${total} organisations`,
    },
    filters: {
      selectCountry: "Choisir un pays",
      allCountries: "Tous les pays",
    },
    card: {
      fansCanLabel: "LES FANS PEUVENT",
      defaultCtaText: "S'impliquer",
      descriptionTooltip: "Dans les mots de l'organisation",
      copyDescription: "Copier",
      descriptionCopied: "Copié",
    },
    empty: {
      noResults: {
        title: "Aucune organisation trouvée",
        description: "Essayez de modifier votre recherche ou vos filtres",
      },
      noData: {
        title: "Aucune organisation disponible pour l'instant",
        description:
          "Nous construisons encore notre réseau d'organisations climatiques. Revenez bientôt !",
      },
      error: {
        title: "Une erreur s'est produite",
        description:
          "Nous n'avons pas pu charger les organisations. Veuillez réessayer.",
        retry: "Réessayer",
      },
    },
    footer: {
      partOf: "Une initiative de",
      mde: "Music Declares Emergency",
      initiative: "",
      tagline: "Pas de musique sur une planète morte.",
      copyright: "Music Declares Emergency. Tous droits réservés.",
    },
  },
};

export function getDirectoryContent(locale: Locale = "en") {
  return directoryContent[locale] || directoryContent.en;
}
