export const PAYMENT_PLANS = {
  starter: { id: 'starter', name: 'Wingo Starter', amount: 499, durationDays: 7 },
  elite: { id: 'elite', name: 'Wingo Elite', amount: 999, durationDays: 10 },
  max: { id: 'max', name: 'Wingo Max Pro', amount: 1599, durationDays: 30 },
  smart: { id: 'smart', name: 'Wingo Smart AI', amount: 2499, durationDays: 45 },
  neural: { id: 'neural', name: 'Wingo Neural Pro', amount: 3999, durationDays: 90 },
  lifetime: { id: 'lifetime', name: 'Wingo Lifetime Quantum', amount: 4999, durationDays: 3650 },
} as const;

export type PaymentPlanId = keyof typeof PAYMENT_PLANS;

export function getPaymentPlan(planId: unknown) {
  if (typeof planId !== 'string' || !(planId in PAYMENT_PLANS)) return null;
  return PAYMENT_PLANS[planId as PaymentPlanId];
}
