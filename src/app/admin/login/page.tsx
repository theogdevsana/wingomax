"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, KeyRound, AlertCircle, Eye, EyeOff, Zap } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";
import { validateLoginCredentials } from "@/lib/security";

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("admin_user");
    const savedPass = localStorage.getItem("admin_pass");
    if (savedUser) setUsername(savedUser);
    if (savedPass) setPassword(savedPass);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validation = validateLoginCredentials(username, password);
    if (!validation.valid) {
      setError(validation.errors[0] || "Invalid input");
      return;
    }
    setIsLoading(true);
    try {
      const passwordHash = await sha256(password);
      const res = await fetch(getApiUrl("/v1/admin/login"), { 
        credentials: 'include', 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: passwordHash }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        localStorage.setItem("admin_user", username);
        localStorage.setItem("admin_pass", password);
        router.push("/");
      } else {
        setError(data.msg || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 p-4">

      <div className="relative z-10 w-full" style={{ maxWidth: "min(100%, 28rem)" }}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-primary-2)] flex items-center justify-center shadow-lg mb-4" style={{ boxShadow: '0 8px 24px rgba(123, 94, 167, 0.2)' }}>
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Wingo Admin</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Sign in to management panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--admin-border)] shadow-xl p-6 sm:p-8 space-y-5" style={{ boxShadow: 'var(--admin-shadow-lg)' }}>
        {error && (
          <div className="px-4 py-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-semibold text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

          <div className="space-y-2">
            <label className="admin-label mb-2">Admin ID</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Enter admin ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input pl-12 pr-4"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="admin-label mb-2">Password</label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-4 text-slate-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input pl-12 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200/50 transition-all"
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="admin-btn admin-btn-primary w-full mt-2 py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p className="text-center text-xs text-gray-300 font-medium mt-6">Protected admin access</p>
      </div>
    </div>
  );
}
