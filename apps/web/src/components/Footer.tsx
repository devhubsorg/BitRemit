export function Footer() {
  return (
    <footer className="border-t border-white/6 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0a0a0a] font-black text-sm"
              style={{ backgroundColor: "#F7931A" }}
            >
              ₿
            </span>
            <span className="text-base font-bold text-white">BitRemit</span>
          </div>

          {/* Mezo badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-xs font-medium text-zinc-400">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="#F7931A" strokeWidth="2" />
              <path
                d="M8 12l2.5 2.5L16 9"
                stroke="#F7931A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Built on Mezo Testnet
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a
              href="https://mezo.org"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-300"
            >
              Mezo
            </a>
            <a
              href="/privacy"
              className="transition-colors hover:text-zinc-300"
            >
              Privacy
            </a>
            <a href="/terms" className="transition-colors hover:text-zinc-300">
              Terms
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs leading-relaxed text-zinc-600">
          BitRemit is a testnet application. All transactions use test funds and
          have no real monetary value. Not financial advice. Cryptocurrency
          involves risk — only use funds you can afford to lose.
        </p>
      </div>
    </footer>
  );
}
