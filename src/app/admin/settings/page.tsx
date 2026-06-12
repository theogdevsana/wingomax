"use client";

import { useState, useEffect } from "react";
import { Save, Link as LinkIcon, Loader2 } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";

export default function SettingsPage() {
  const [telegramLink, setTelegramLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/v1/settings"), { credentials: 'include' });
      const data = await res.json();
      if (data.status === "success") {
        setTelegramLink(data.data.subscription_link);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(getApiUrl("/v1/admin/settings"), { credentials: 'include', 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramLink }),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        setMessage({ text: "Settings saved successfully!", type: "success" });
      } else {
        setMessage({ text: data.msg || "Failed to save settings.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred while saving.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-page max-w-3xl">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Configuration</p>
          <h1 className="admin-title">Platform Settings</h1>
          <p className="admin-subtitle">Manage global settings and links for the Wingo Signal platform.</p>
        </div>
      </div>

      <div className="admin-panel">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <LinkIcon size={20} className="text-[#7B5EA7]" />
            External Links
          </h2>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-[#7B5EA7]" size={32} />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              
              {message.text && (
                <div className={`p-4 rounded-xl text-sm font-medium ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="telegramLink" className="block text-sm font-bold text-slate-700">
                  Telegram Channel / Support Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="url"
                    id="telegramLink"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    required
                  className="block w-full pl-10 pr-3 py-3 border border-black/[0.06] bg-gray-50/80 rounded-2xl focus:ring-2 focus:ring-[#7B5EA7]/20 focus:border-[#7B5EA7]/40 sm:text-sm font-medium transition-all"
                    placeholder="https://t.me/yourtelegram"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  This link will be updated everywhere on the platform (except blog posts).
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="admin-action bg-[#7B5EA7] hover:brightness-110 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
