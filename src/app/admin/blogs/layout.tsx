import { ReactNode } from "react";

export default function BlogsAdminLayout({ children }: { children: ReactNode }) {
  return <div className="admin-blogs-page">{children}</div>;
}
