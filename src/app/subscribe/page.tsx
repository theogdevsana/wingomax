import { Metadata } from 'next';
import styles from './page.module.css';
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export const metadata: Metadata = {
  title: "Pricing & Subscription | Wingo Signal Premium",
  description: "Get premium access to Wingo Signal AI tools. Choose from Starter, Elite, and Max Pro plans for maximum accuracy in game predictions.",
  keywords: ["wingo subscription", "wingo premium access", "wingo vip signals", "wingo tool pricing"],
};

const PLANS = [
  {
    title: "Wingo Starter",
    subtitle: "Best for Beginners",
    price: "₹499",
    period: "7 Days Access",
    features: [
      "Basic Market Insights",
      "Live Trend Tracking",
      "Starter Signal Pack",
      "Telegram Support",
      "Fast Result Analysis",
    ],
    gradient: ["#007AFF", "#00C6FF"],
    blob1: "rgba(0,122,255,0.12)",
    blob2: "rgba(0,198,255,0.06)",
    isFeatured: false,
    badge: "Basic",
  },
  {
    title: "Wingo Elite",
    subtitle: "Most Popular Choice",
    price: "₹1499",
    period: "10 Days Access",
    features: [
      "Advanced Pattern Analysis",
      "High Accuracy Signals",
      "VIP Community Access",
      "Priority Support",
      "Real-time Alerts",
    ],
    gradient: ["#AF52DE", "#6E56FF"],
    blob1: "rgba(175,82,222,0.12)",
    blob2: "rgba(110,86,255,0.06)",
    isFeatured: true,
    badge: "Best Choice",
  },
  {
    title: "Wingo Max Pro",
    subtitle: "Ultimate Lifetime Power",
    price: "₹2499", 
    period: "30 Days Access",
    features: [
      "Full AI Prediction Engine",
      "Neural-Based Smart Signals",
      "Unlimited Premium Access",
      "24/7 Dedicated Support",
      "Custom Prediction Strategy",
    ],
    gradient: ["#34C759", "#2EBD59"],
    blob1: "rgba(52,199,89,0.12)",
    blob2: "rgba(46,189,89,0.06)",
    isFeatured: false,
    badge: "VIP",
  },
];

export default async function SubscribePage() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  return (
    <div className={styles.container}>
      {/* Background decor circles */}
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />

      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Choose Your Plan</h1>
        </div>

        <div className={styles.plansList}>
          {PLANS.map((plan) => (
            <div
              key={plan.title}
              className={`${styles.planCard} ${plan.isFeatured ? styles.planCardFeatured : ""}`}
              style={{
                "--grad0": plan.gradient[0],
                "--grad1": plan.gradient[1],
                "--blob1": plan.blob1,
                "--blob2": plan.blob2,
                "--border-color": plan.isFeatured ? `${plan.gradient[0]}4D` : "transparent",
              } as React.CSSProperties}
            >
              {/* Blob decorations */}
              <div className={styles.blobTopRight} />
              <div className={styles.blobBottomLeft} />

              {/* Card header */}
              <div className={styles.planHeader}>
                <div className={styles.planTitleRow}>
                  <span className={styles.planTitle}>{plan.title}</span>
                  {plan.badge && (
                    <span className={styles.recommendedBadge}>{plan.badge}</span>
                  )}
                </div>
                <p className={styles.planSubtitle}>{plan.subtitle}</p>

                <div className={styles.priceRow}>
                  <span className={styles.planPrice}>{plan.price}</span>
                  <span className={styles.planPeriod}>/ {plan.period}</span>
                </div>
              </div>

              {/* Divider */}
              <div className={styles.planDivider} />

              {/* Features */}
              <div className={styles.planFeatures}>
                {plan.features.map((f) => (
                  <div key={f} className={styles.featureRow}>
                    <span className={styles.featureCheck}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className={styles.featureText}>{f}</span>
                  </div>
                ))}

                {/* CTA Button */}
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.planBtn}
                >
                  Upgrade Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}