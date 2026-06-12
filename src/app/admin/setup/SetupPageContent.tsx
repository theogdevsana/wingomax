"use client";

import { useState } from "react";
import SetupForm from "./SetupForm";
import AdminList from "./AdminList";

export default function SetupPageContent() {
  const [listRefreshKey, setListRefreshKey] = useState(0);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--admin-bg)] p-4 lg:p-8">
      <div className="absolute inset-x-0 top-0 h-2 bg-[#7B5EA7]" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-5 lg:gap-8 items-stretch lg:items-start">
        <div className="w-full lg:w-1/2 flex justify-center">
          <SetupForm onAdminCreated={() => setListRefreshKey((k) => k + 1)} />
        </div>
        <AdminList refreshKey={listRefreshKey} />
      </div>
    </div>
  );
}
