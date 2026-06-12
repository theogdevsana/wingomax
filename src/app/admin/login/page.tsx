"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, KeyRound, AlertCircle, Eye, EyeOff, Zap } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";
import { validateLoginCredentials } from "@/lib/security";

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

    // Client-side validation
    const validation = validateLoginCredentials(username, password);
    if (!validation.valid) {
      setError(validation.errors[0] || "Invalid input");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(getApiUrl("/v1/admin/login"), { 
        credentials: 'include', 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        localStorage.setItem("admin_user", username);
        localStorage.setItem("admin_pass", password);
        // On admin.wingosignals.xyz, '/' rewrites to /admin via proxy
        // Using '/admin' directly would result in /admin/admin (double prefix)
        router.push("/");
      } else {
        // Don't reveal if username exists or not
        setError(data.msg || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 p-4">

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#7B5EA7] to-[#9B7FBF] flex items-center justify-center shadow-lg shadow-[#7B5EA7]/20 mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Wingo Admin</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">Sign in to management panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.04] shadow-xl shadow-black/[0.03] p-6 sm:p-8 space-y-5">
        {error && (
          <div className="px-4 py-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-semibold text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">Admin ID</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Enter admin ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#7B5EA7] focus:bg-white transition-all font-semibold text-sm text-gray-900"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">Password</label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-4 text-slate-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#7B5EA7] focus:bg-white transition-all font-semibold text-sm text-gray-900"
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
            className="admin-action w-full mt-2 py-3.5 bg-gradient-to-r from-[#7B5EA7] to-[#9B7FBF] text-white rounded-xl font-extrabold text-sm shadow-lg shadow-[#7B5EA7]/20 hover:shadow-xl hover:shadow-[#7B5EA7]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
