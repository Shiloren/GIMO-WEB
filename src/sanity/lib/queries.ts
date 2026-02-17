import { groq } from "next-sanity";

export const landingDataQuery = groq`
{
  "siteSettings": *[_type == "siteSettings"][0] {
    siteName,
    signInLabel,
    footerCopyright,
    navItems[] {
      label,
      href
    }
  },
  "landingPage": *[_type == "landingPage"][0] {
    heroBadge,
    heroTitleLine1,
    heroTitleLine2,
    heroDescription,
    heroCtas[] {
      label,
      href,
      variant
    },
    trustTitle,
    trustLogos[] {
      label
    },
    featuresTitle,
    featuresDescription,
    features[] {
      title,
      description,
      icon,
      accent
    },
    codeSectionTitle1,
    codeSectionTitle2,
    codeSectionDescription,
    finalCtaTitle,
    finalCtas[] {
      label,
      href,
      variant
    }
  }
}`;
