"use client";

import { useEffect, useState, ReactNode } from "react";
import { KeyRound, Lock, AlertCircle } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";

export default function SetupGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const stored = sessionStorage.getItem("setup_unlocked");
      if (stored !== "true") {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(getApiUrl("/v1/admin/setup/admins"), { credentials: 'include' });
        if (res.ok) {
          setUnlocked(true);
        } else {
          sessionStorage.removeItem("setup_unlocked");
        }
      } catch {
        sessionStorage.removeItem("setup_unlocked");
      } finally {
        setChecking(false);
      }
    }

    checkAccess();
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(getApiUrl("/v1/admin/setup/verify"), { credentials: 'include', 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        sessionStorage.setItem("setup_unlocked", "true");
        setUnlocked(true);
      } else {
        setError(data.msg || "Wrong password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)]">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--admin-bg)] p-4">
        <div className="absolute inset-x-0 top-0 h-2 bg-blue-600" />

        <div className="admin-panel relative z-10 w-full max-w-md p-6 sm:p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl shadow-lg flex items-center justify-center">
              <Lock className="text-white" size={32} />
            </div>
          </div>

          <h1 className="admin-title text-center mb-2">
            Setup Access
          </h1>
          <p className="text-center text-slate-500 font-medium mb-8">
            Enter the setup password to manage admin accounts.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-medium text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Setup Password
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-4 text-slate-400" size={20} />
                <input
                  type="password"
                  placeholder="Enter setup password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="admin-action w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Unlock Setup"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
