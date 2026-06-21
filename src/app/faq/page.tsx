import type { Metadata } from "next";
import PublicInfoPage from "@/components/PublicInfoPage";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = { title:"Wingo Signal FAQ | Access, Data and Predictions", description:"Answers about Wingo Signal access, supported round intervals, history data, prediction limitations, device use, and account support.", alternates:{canonical:"/faq"} };
const faqs = [
  {question:"What does Wingo Signal show?",answer:"It organizes recent Wingo results and produces statistical trend indicators for 30-second, 1-minute, 3-minute, and 5-minute round formats."},
  {question:"Does a signal guarantee the next result?",answer:"No. Signals are based on historical and recent data. Randomness, operator changes, delays, and incomplete data can make any prediction incorrect."},
  {question:"Do I need to install an APK?",answer:"No. The current product works in a supported web browser. Avoid unofficial downloads that claim to represent Wingo Signal."},
  {question:"Why can a round be skipped?",answer:"A round may be skipped when the service cannot verify enough current data or when the pattern does not meet the configured confidence rules."},
  {question:"Can I use one license on multiple devices?",answer:"Device rules depend on the license configuration shown when access is issued. Contact support before moving an active license to another device."},
  {question:"Where can I get account help?",answer:"Use the official support link displayed on this website. Never share passwords, one-time codes, or payment credentials with an unsolicited contact."},
];
const sections=[
  {id:"using-the-tool",title:"Using the tool",paragraphs:["Choose the same interval that you are viewing on your game platform, confirm the current period, and read the signal before the round closes. If the period does not match, wait for the next refresh rather than forcing a decision."]},
  {id:"data-delays",title:"Data and refresh delays",paragraphs:["History is supplied by external data services and can occasionally arrive late. The interface may show a loading, fallback, or skipped state while it waits for a usable response."]},
  {id:"responsible-use",title:"Responsible use",paragraphs:["Treat every output as uncertain statistical information. Set limits, avoid chasing losses, and stop if the activity is affecting your finances or wellbeing."],note:"Wingo Signal is not financial advice and does not guarantee winnings."},
];
export default function FaqPage(){return <><JsonLd breadcrumbs={[{name:"Home",item:"/"},{name:"FAQ",item:"/faq"}]} faq={faqs}/><PublicInfoPage eyebrow="Help centre" title="Frequently asked questions" intro="Straight answers about how the product works, what its signals mean, and where its limitations begin." sections={sections} faqs={faqs}/></>}
