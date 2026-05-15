"use client";

import { useState, useEffect } from "react";
import { Save, Link as LinkIcon, Loader2 } from "lucide-react";

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
      const res = await fetch("/api/settings");
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
      const res = await fetch("/api/admin/settings", {
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Platform Settings</h1>
        <p className="text-slate-500">Manage global settings and links for the Wingo Signal platform.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <LinkIcon size={20} className="text-blue-500" />
            External Links
          </h2>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-blue-500" size={32} />
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
                    <span className="text-slate-400 sm:text-sm">🔗</span>
                  </div>
                  <input
                    type="url"
                    id="telegramLink"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
