"use client";

import { useState } from "react";
import SetupForm from "./SetupForm";
import AdminList from "./AdminList";

export default function SetupPageContent() {
  const [listRefreshKey, setListRefreshKey] = useState(0);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F5F5F7] p-4 lg:p-8">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-1/2 flex justify-center">
          <SetupForm onAdminCreated={() => setListRefreshKey((k) => k + 1)} />
        </div>
        <AdminList refreshKey={listRefreshKey} />
      </div>
    </div>
  );
}
