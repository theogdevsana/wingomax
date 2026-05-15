import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

const SLUG_TO_LABEL: Record<string, string> = {
  'wingo-30-seconds-prediction': '30 Seconds',
  'wingo-1-minute-prediction': '1 Minute',
  'wingo-3-minute-prediction': '3 Minutes',
  'wingo-5-minute-prediction': '5 Minutes'
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug || "wingo-1-minute-prediction";
  const gameLabel = SLUG_TO_LABEL[slug] || '1 Minute';
  
  return {
    title: `Wingo ${gameLabel} Prediction Tool - Free AI Analyst`,
    description: `Get real-time Wingo ${gameLabel} results with our AI-powered free prediction tool.`,
    alternates: {
      canonical: `https://wingosignal.com/${slug}`,
    }
  };
}

export default function PredictionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
