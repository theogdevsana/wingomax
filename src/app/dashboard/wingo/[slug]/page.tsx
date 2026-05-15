import HistoryClient from "../HistoryClient";

export const metadata = {
  title: "Game History | Wingo Signal",
  description: "View real-time Wingo game history and results.",
};

export default async function HistoryGamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <HistoryClient slug={slug} />;
}
