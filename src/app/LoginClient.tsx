"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import BackgroundSvg from "@/components/BackgroundSvg";

const Toast = dynamic(() => import("@/components/Toast"), { ssr: false });

export default function LoginPage() {
  const router = useRouter();
  const [loginKey, setLoginKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionLink, setSubscriptionLink] = useState<string>("https://t.me/enzosrs");
  const [toast, setToast] = useState<{ message: string; subText: string; type: "success" | "error" | "warning" } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.status === "success") {
          setSubscriptionLink(json.data.subscription_link);
        }
      } catch (err) {
        console.warn("Silent settings fetch failed:", err);
      }
    };
    fetchSettings();
  }, []);

  const iosBlue = "#007AFF";
  const iosPurple = "#AF52DE";

  const getOrCreateDeviceId = () => {
    // Check if device ID exists in cookies
    const match = document.cookie.match(/(^|;)\s*device_id\s*=\s*([^;]+)/);
    if (match) return match[2];
    
    // Generate new device ID
    const newDeviceId = "dev_" + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
    // Set cookie for 10 years
    document.cookie = `device_id=${newDeviceId}; path=/; max-age=315360000; SameSite=Lax`;
    return newDeviceId;
  };

  useEffect(() => {
    const saved = localStorage.getItem("login_key");
    if (saved) setLoginKey(saved);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);



  const handleLogin = async () => {
    if (isLoading) return;
    const enteredKey = loginKey.trim();
    if (!enteredKey) {
      setToast({
        message: "Key Required",
        subText: "Please enter your login key !",
        type: "warning",
      });
      return;
    }


    setIsLoading(true);
    try {
      const deviceId = getOrCreateDeviceId();
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: enteredKey, device_id: deviceId }),
        signal: AbortSignal.timeout(10000),
      });
      let jsonResponse: any;
      try {
        jsonResponse = await res.json();
      } catch {
        setToast({
          message: "Format Error",
          subText: "Server returned invalid data format.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }
      if (res.status === 200 && jsonResponse.status === "success") {
        setToast({
          message: "Login Success",
          subText: "Welcome to the dashboard !",
          type: "success",
        });

        localStorage.setItem("login_key", enteredKey);
        
        // Wait a bit for toast to be seen before redirecting
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        const rawMsg = jsonResponse?.msg;
        const safeMsg =
          typeof rawMsg === "string" && rawMsg.length > 0
            ? rawMsg.replace(/<[^>]*>/g, "")
            : "Login failed. Please try again.";
        
        setToast({
          message: "Login Failed",
          subText: safeMsg,
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "Connection Error",
        subText: "Please check your internet connection.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <BackgroundSvg blueColor={iosBlue} purpleColor={iosPurple} />
      {toast && (
        <Toast
          message={toast.message}
          subText={toast.subText}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome !</h1>
        <p className={styles.subtitle}>Please enter your credentials</p>
        <div className={styles.form}>
          <label className={styles.label}>
            Login Key <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWrapper}>
            <div className={styles.inputInner}>
              <svg
                className={styles.lockIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={iosBlue}
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
               <input
                type="text"
                value={loginKey}
                onChange={(e) => setLoginKey(e.target.value)}
                placeholder="Enter your login key !"
                className={styles.input}
                aria-label="Login key"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
            </div>
            <div className={styles.gradientBar} />
          </div>
           <button
            onClick={handleLogin}
            disabled={isLoading}
            className={styles.loginButton}
            aria-label="Login"
          >
            {isLoading ? (
              <svg width="20" height="20" viewBox="0 0 20 20" className={styles.spinner}>
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="40"
                  strokeDashoffset="10"
                />
              </svg>
            ) : (
              "LOGIN"
            )}
          </button>
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>Or Get Key !</span>
            <div className={styles.dividerLine} />
          </div>
          <button
            onClick={() => {
              router.push("/subscribe");
            }}
            className={styles.purchaseButton}
          >
            Purchase Subscription
          </button>
        </div>
      </div>
    </main>
  );
}