import { Metadata } from 'next';
import styles from './page.module.css';
import PlanPurchaseButton from './PlanPurchaseButton';

export const metadata: Metadata = {
  title: "Pricing & Subscription | Wingo Signal Premium",
  description: "Compare Wingo Signal access plans by duration, dashboard features, and support level. Statistical signals never guarantee a result.",
  keywords: ["wingo subscription", "wingo premium access", "wingo vip signals", "wingo tool pricing"],
  alternates: {
    canonical: '/subscribe',
  },
};

const PLANS = [
  {
    id: 'starter',
    title: "Wingo Starter",
    subtitle: "Best for Beginners",
    price: "₹499",
    period: "7 Days Access",
    features: [
      "Basic statistical signals",
      "Live Profitable Trend Scan",
      "Double-Chance Safe Signals",
      "Dedicated Telegram Support",
      "Instant Win/Loss Prediction Alerts",
    ],
    gradient: ["#007AFF", "#00C6FF"],
    blob1: "rgba(0,122,255,0.12)",
    blob2: "rgba(0,198,255,0.06)",
    isFeatured: false,
    badge: "Basic",
  },
  {
    id: 'elite',
    title: "Wingo Elite",
    subtitle: "Most Popular Choice",
    price: "₹999",
    period: "10 Days Access",
    features: [
      "Expanded signal access",
      "Advanced Fast Pattern Tracker",
      "Direct VIP Channel Access",
      "24/7 Priority Support Desk",
      "Secret Profit-Boosting Tricks",
    ],
    gradient: ["#AF52DE", "#6E56FF"],
    blob1: "rgba(175,82,222,0.12)",
    blob2: "rgba(110,86,255,0.06)",
    isFeatured: true,
    badge: "Best Choice",
  },
  {
    id: 'max',
    title: "Wingo Max Pro",
    subtitle: "Ultimate Lifetime Power",
    price: "₹1599", 
    period: "30 Days Access",
    features: [
      "Full live signal dashboard",
      "Full Live AI Signal Dashboard",
      "Multi-Game Prediction Unlocked",
      "1-on-1 Risk Minimizer Guide",
      "Account and setup guidance",
    ],
    gradient: ["#34C759", "#2EBD59"],
    blob1: "rgba(52,199,89,0.12)",
    blob2: "rgba(46,189,89,0.06)",
    isFeatured: false,
    badge: "VIP",
  },
  {
    id: 'smart',
    title: "Wingo Smart AI",
    subtitle: "AI-Powered Predictions",
    price: "₹2499",
    period: "45 Days Access",
    features: [
      "Automated signal refresh",
      "Extended dashboard access",
      "Self-Learning Auto-Correct AI",
      "Premium Telegram Bot Hookup",
      "Refund review under published policy",
    ],
    gradient: ["#FF9500", "#FFCC00"],
    blob1: "rgba(255,149,0,0.12)",
    blob2: "rgba(255,204,0,0.06)",
    isFeatured: false,
    badge: "AI Boosted",
  },
  {
    id: 'neural',
    title: "Wingo Neural Pro",
    subtitle: "Ultra Advanced Algorithmic Edge",
    price: "₹3999",
    period: "90 Days Access",
    features: [
      "Additional trend views",
      "Long-duration access",
      "Highly Tuned Low-Risk Signals",
      "Direct Priority Dev Support Line",
      "Refund review under published policy",
    ],
    gradient: ["#FF2D55", "#FF3B30"],
    blob1: "rgba(255,45,85,0.12)",
    blob2: "rgba(255,59,48,0.06)",
    isFeatured: false,
    badge: "Advanced",
  },
  {
    id: 'lifetime',
    title: "Wingo Lifetime Quantum",
    subtitle: "Ultimate Lifetime Power Plan",
    price: "₹4999",
    period: "Lifetime VIP Access",
    features: [
      "Lifetime dashboard access",
      "All available interval views",
      "Statistical sequence summaries",
      "Priority support channel",
      "Refund review under published policy",
    ],
    gradient: ["#7F00FF", "#00F2FE"],
    blob1: "rgba(127,0,255,0.12)",
    blob2: "rgba(0,242,254,0.06)",
    isFeatured: false,
    badge: "Ultimate VIP",
  },
];

export default async function SubscribePage() {
  const standardPlans = PLANS.slice(0, 3);
  const advancedPlans = PLANS.slice(3, 6);

  return (
    <div className={styles.container}>
      {/* Background decor circles */}
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />

      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Choose Your Plan</h1>
        </div>

        {/* Section 1: Standard Plans */}
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Standard Prediction Plans</h2>
            <p className={styles.sectionDesc}>History and signal tools for daily review</p>
          </div>
          <span className={styles.sectionTag} style={{ backgroundColor: "rgba(0,122,255,0.1)", color: "#007AFF" }}>
            Popular
          </span>
        </div>
        <div className={styles.plansList}>
          {standardPlans.map((plan) => (
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
                <PlanPurchaseButton planId={plan.id} />
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Advanced AI & VIP Plans */}
        <div className={styles.sectionHeader} style={{ marginTop: "48px", borderLeftColor: "#AF52DE" }}>
          <div>
            <h2 className={styles.sectionTitle}>Advanced AI & VIP Plans</h2>
            <p className={styles.sectionDesc}>Neural networks & lifetime priority edge</p>
          </div>
          <span className={styles.sectionTag} style={{ backgroundColor: "rgba(175,82,222,0.1)", color: "#AF52DE" }}>
            AI Engine
          </span>
        </div>
        <div className={styles.plansList}>
          {advancedPlans.map((plan) => (
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
                <PlanPurchaseButton planId={plan.id} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
