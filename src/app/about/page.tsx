import type { Metadata } from "next";
import PublicInfoPage from "@/components/PublicInfoPage";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About Wingo Signal | Statistical Wingo Analysis",
  description: "Learn how Wingo Signal organizes recent round data into readable Wingo trend indicators, what the service can and cannot do, and how we approach responsible use.",
  alternates: { canonical: "/about" },
};

const sections = [
  { id:"what-we-build", title:"What we build", paragraphs:["Wingo Signal is a browser-based analysis interface for people who want to review recent Wingo results without manually arranging every round. The product groups public game history into size, colour, and sequence views so users can inspect short-term movement in one place.","The service is an independent analytics product. It is not operated by, endorsed by, or connected to any game operator named on the site."] },
  { id:"how-it-works", title:"How the analysis works", paragraphs:["The interface reads recent result history, converts it into consistent labels, and applies statistical rules to identify streaks, reversals, and mixed sequences. A displayed signal is an interpretation of available data, not advance knowledge of the next result."], bullets:["Recent-round sequence checks","Big and small distribution summaries","Colour frequency and streak context","Clear skip states when data is incomplete or inconsistent"] },
  { id:"our-standard", title:"Our product standard", paragraphs:["We prefer clear limitations over exaggerated promises. Pages are reviewed for readable language, mobile accessibility, and accurate descriptions of the current product. When a feature changes, its supporting page should change with it."], note:"No statistical tool can guarantee a future game result. Users should never treat a signal as financial advice or risk money they cannot afford to lose." },
  { id:"independence", title:"Independence and support", paragraphs:["Wingo Signal does not claim insider access, operator control, or a hidden game-server connection. Support is provided for access, account, and product-use questions through the contact channel shown on the website."] },
];

export default function AboutPage(){ return <><JsonLd breadcrumbs={[{name:"Home",item:"/"},{name:"About",item:"/about"}]} /><PublicInfoPage eyebrow="Company" title="About Wingo Signal" intro="A practical Wingo history and trend-analysis interface built around clarity, speed, and honest limitations." sections={sections} /></>; }
