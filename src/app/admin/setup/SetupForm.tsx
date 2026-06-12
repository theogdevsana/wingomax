"use client";

import { useState } from "react";
import { User, KeyRound, AlertCircle, ShieldCheck } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";

export default function SetupForm({
  onAdminCreated,
}: {
  onAdminCreated?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(getApiUrl("/v1/admin/register"), { credentials: 'include', 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSuccess("Admin created successfully!");
        setUsername("");
        setPassword("");
        onAdminCreated?.();
      } else {
        setError(data.msg || "Registration failed");
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-panel relative z-10 w-full max-w-md p-6 sm:p-8 shadow-2xl">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center">
          <ShieldCheck className="text-white" size={32} />
        </div>
      </div>

      <h1 className="admin-title text-center mb-2">Setup Admin</h1>
      <p className="text-center text-slate-500 font-medium mb-8">Create your admin account.</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-medium text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-3 font-medium text-sm">
          <AlertCircle size={18} /> {success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Admin Username</label>
          <div className="relative flex items-center">
            <User className="absolute left-4 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#7B5EA7] focus:bg-white transition-all font-medium text-slate-900"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
          <div className="relative flex items-center">
            <KeyRound className="absolute left-4 text-slate-400" size={20} />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#7B5EA7] focus:bg-white transition-all font-medium text-slate-900"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !!success}
          className="admin-action w-full mt-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Create Admin Account"
          )}
        </button>
      </form>
    </div>
  );
}
