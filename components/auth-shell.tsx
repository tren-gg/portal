import type { ReactNode } from "react";

import { AsciiFlowBackground } from "@/components/ascii-flow-background";
import { SyringeMark } from "@/components/syringe-mark";
import { env } from "@/lib/env";

export function AuthBrand() {
  return (
    <span className="inline-flex items-center gap-3 text-white">
      <SyringeMark className="h-5 w-5" />
      <span className="text-2xl font-medium leading-none tracking-[0]">tren.</span>
    </span>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative isolate grid min-h-dvh grid-rows-[auto_1fr_auto] overflow-hidden bg-[#070708] text-white">
      <AsciiFlowBackground className="z-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_60%_50%_at_center,rgba(7,7,8,0.55)_0%,rgba(7,7,8,0)_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-2.5rem] z-[2] select-none overflow-hidden text-center text-[clamp(9rem,24vw,18rem)] font-medium leading-[0.82] tracking-[0] text-white/[0.055]"
      >
        tren.
      </div>

      <header className="relative z-10 flex min-h-14 items-center justify-between border-b border-white/10 bg-[#070708]/65 px-6">
        <a href={env.MARKETING_URL} aria-label="Tren" className="inline-flex">
          <AuthBrand />
        </a>
        <a
          href={env.MARKETING_URL}
          className="hidden text-[13px] text-[#b8b8be] transition-colors hover:text-white sm:inline"
        >
          tren.gg
        </a>
      </header>

      <div className="relative z-10 flex min-h-0 items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        {children}
      </div>

      <footer className="relative z-10 flex min-h-12 items-center justify-between gap-5 border-t border-white/10 px-6 text-[10px] font-medium uppercase tracking-[0] text-[#8a8a92]">
        <span>Built for players.</span>
        <span className="hidden sm:inline">Portal / secure sign-in</span>
      </footer>
    </main>
  );
}
