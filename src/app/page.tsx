import { GimoLanding } from "@/components/gimo-landing";
import { defaultLandingData, mergeLandingData, type LandingData } from "@/lib/default-content";
import { sanityClient } from "@/sanity/lib/client";
import { landingDataQuery } from "@/sanity/lib/queries";

async function getLandingData(): Promise<LandingData> {
  try {
    const data = await sanityClient.fetch<Partial<LandingData>>(landingDataQuery, {}, { next: { revalidate: 60 } });
    return mergeLandingData(data);
  } catch {
    return defaultLandingData;
  }
}

export default async function Home() {
  const data = await getLandingData();
  return <GimoLanding data={data} />;
}
