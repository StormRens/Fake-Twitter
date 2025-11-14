import { Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="min-h-svh bg-gradient-to-b from-brand-bg to-brand-bg2 text-brand-text">
      {/* later you can move the navbar/sidebar here so every page shares it */}
      <Outlet />
    </div>
  );
}
