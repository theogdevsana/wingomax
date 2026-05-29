"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, AlertCircle } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";

type AdminRow = {
  id: string;
  username: string;
  createdAt: string;
};

export default function AdminList({ refreshKey }: { refreshKey: number }) {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(getApiUrl("/v1/admin/setup/admins"));
      if (!res.ok) {
        setError("Could not load admin list");
        setAdmins([]);
        return;
      }
      const data = await res.json();
      setAdmins(data.admins ?? []);
    } catch {
      setError("Network error loading admins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins, refreshKey]);

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Delete admin "${username}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(getApiUrl(`/v1/admin/setup/admins?id=${encodeURIComponent(id)}`), {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        setAdmins((prev) => prev.filter((a) => a.id !== id));
      } else {
        setError(data.msg || "Failed to delete admin");
      }
    } catch {
      setError("Network error while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full lg:w-1/2 bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-[2rem] shadow-2xl h-[500px] flex flex-col">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Existing Admins</h2>
      <p className="text-slate-500 font-medium mb-4">
        List of all admin accounts. You can delete any admin here.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : admins.length > 0 ? (
          admins.map((admin) => (
            <div
              key={admin.id}
              className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                  {admin.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="block font-bold text-slate-700 truncate">
                    {admin.username}
                  </span>
                  <span className="block text-xs text-slate-500">
                    Joined:{" "}
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(admin.id, admin.username)}
                disabled={deletingId === admin.id}
                className="shrink-0 ml-3 p-2.5 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors disabled:opacity-50"
                title={`Delete ${admin.username}`}
              >
                {deletingId === admin.id ? (
                  <div className="w-5 h-5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 font-medium">
            No admins found. Create the first one!
          </div>
        )}
      </div>
    </div>
  );
}
