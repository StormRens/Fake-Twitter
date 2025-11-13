import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-svh relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-brand-bg to-brand-bg2 text-brand-text">
      {/* ORBS BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        {/* Left blue orb */}
        <div
          className="
            absolute -left-40 -top-32 h-72 w-72 rounded-full
            bg-[radial-gradient(circle_at_center,#6b9cff,transparent_60%)]
            opacity-55 blur-3xl
            animate-[orb-float_6s_ease-in-out_infinite]
          "
        />

        {/* Bottom teal orb */}
        <div
          className="
            absolute bottom-[-7rem] left-70 h-64 w-64 rounded-full
            bg-[radial-gradient(circle_at_center,#3dd3b0,transparent_60%)]
            opacity-45 blur-3xl
            animate-[orb-float-2_7s_ease-in-out_infinite]
          "
        />

        {/* Right purple orb */}
        <div
          className="
            absolute -right-40 top-[30%] -translate-y-1/2 h-72 w-72 rounded-full
            bg-[radial-gradient(circle_at_center,#9a6bff,transparent_60%)]
            opacity-55 blur-3xl
            animate-[orb-float-3_5.5s_ease-in-out_infinite]
          "
        />
      </div>

      {/* Content wrapper stays above orbs */}
      <div className="relative z-10 w-full max-w-md px-4 py-12 sm:px-6">
        <Outlet />
      </div>
    </div>
  );
}
