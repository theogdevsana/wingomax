import type { Metadata } from "next";
import PublicInfoPage from "@/components/PublicInfoPage";

export const metadata: Metadata={title:"Terms of Use | Wingo Signal",description:"Terms governing Wingo Signal accounts, licenses, statistical outputs, acceptable use, payments, and service limitations.",alternates:{canonical:"/terms"}};
const sections=[
  {id:"service",title:"The service",paragraphs:["Wingo Signal provides access to game-history views and statistical indicators. Outputs are informational estimates derived from available data. They are not guarantees, financial advice, or evidence of access to an operator's internal systems."]},
  {id:"eligibility",title:"Eligibility and responsibility",paragraphs:["You are responsible for confirming that use is lawful where you live and that you meet any applicable age requirement. You are also responsible for decisions made after viewing the service and for protecting your login or license information."]},
  {id:"acceptable-use",title:"Acceptable use",paragraphs:["You may not interfere with the service, bypass access controls, automate excessive requests, resell a personal license without permission, impersonate the brand, or use the site to distribute malware or misleading claims."]},
  {id:"payments",title:"Access, payments, and suspension",paragraphs:["Paid access lasts for the term shown at purchase or issuance. We may suspend access connected to fraud, chargebacks, abusive traffic, shared credentials, or a material breach of these terms. Refund reviews follow the separate Refund Policy."]},
  {id:"limitations",title:"Availability and limitations",paragraphs:["External data, network conditions, maintenance, and third-party services can affect availability or timing. To the extent permitted by law, the service is provided without a promise that every signal, history row, or feature will always be uninterrupted or error-free."],note:"Never rely on a prediction as a guaranteed source of income."},
  {id:"changes",title:"Changes and contact",paragraphs:["We may update features or these terms as the service changes. Continued use after an updated version becomes effective means the revised terms apply. Contact official support for questions about access or these terms."]},
];
export default function TermsPage(){return <PublicInfoPage eyebrow="Legal" title="Terms of use" intro="The rules and limitations that apply when you access Wingo Signal and its statistical tools." updated="21 June 2026" sections={sections}/>}
