export type LoginToast = {
  message: string;
  subText: string;
  type: "success" | "error" | "warning";
};

function formatExpiryDate(expiresAt: string | undefined): string | null {
  if (!expiresAt) return null;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getLoginErrorToast(jsonResponse: {
  code?: string;
  msg?: string;
  expires_at?: string;
}): LoginToast {
  const isExpired =
    jsonResponse.code === "expired" ||
    (typeof jsonResponse.msg === "string" &&
      /expir/i.test(jsonResponse.msg));

  if (isExpired) {
    const expiryLabel = formatExpiryDate(jsonResponse.expires_at);
    return {
      message: "Key Expired",
      subText: expiryLabel
        ? `Your key expired on ${expiryLabel}. Please renew your subscription.`
        : "Your license key has expired. Please renew to continue.",
      type: "warning",
    };
  }

  if (jsonResponse.code === "banned") {
    return {
      message: "Key Banned",
      subText: "This license key has been banned. Contact support for help.",
      type: "error",
    };
  }

  const rawMsg = jsonResponse.msg;
  const safeMsg =
    typeof rawMsg === "string" && rawMsg.length > 0
      ? rawMsg.replace(/<[^>]*>/g, "")
      : "Login failed. Please try again.";

  return {
    message: "Login Failed",
    subText: safeMsg,
    type: "error",
  };
}
