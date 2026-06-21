import type { Metadata } from "next";
import PublicInfoPage from "@/components/PublicInfoPage";

export const metadata: Metadata={title:"Refund Policy | Wingo Signal Access",description:"Understand when a Wingo Signal digital-access payment may be reviewed, what evidence is required, and which situations are not eligible.",alternates:{canonical:"/refund"}};
const sections=[
  {id:"digital-access",title:"Digital access purchases",paragraphs:["A license delivers time-limited access to digital features. Once a valid key has been issued and used, the service has begun and the purchase is generally not refundable merely because a user changes their mind."]},
  {id:"eligible",title:"When a review may be available",paragraphs:["Contact support promptly if payment was completed but no valid access was supplied, the same transaction was charged more than once, or a verified technical fault prevented use for a substantial part of the purchased term."],bullets:["Payment reference and date","License or account identifier","A concise description of the issue","Screenshots that do not expose sensitive payment credentials"]},
  {id:"not-eligible",title:"Situations normally not eligible",paragraphs:["A losing session, disagreement with a statistical signal, device-rule violation, account sharing, or failure to use the service does not by itself establish a service-delivery failure. Predictions are uncertain and are never sold as guaranteed outcomes."]},
  {id:"review",title:"Review process",paragraphs:["Support checks payment records, license delivery, device activity, and reported outages. Approved refunds are returned through an available payment method and processing time can depend on the payment provider."],note:"Submit a request as soon as possible. Delayed requests can be harder to verify."},
];
export default function RefundPage(){return <PublicInfoPage eyebrow="Billing" title="Refund policy" intro="How we review payment and digital-access problems while keeping statistical outcomes separate from service delivery." updated="21 June 2026" sections={sections}/>}
