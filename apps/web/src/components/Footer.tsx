import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="border-t px-[5%] py-10"
      style={{ borderColor: "#30363D", background: "#0D1117" }}
    >
      <div className="mx-auto flex max-w-300 flex-wrap items-center justify-between gap-5">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-1.5 no-underline"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "17px",
            color: "#F7931A",
            letterSpacing: "-0.02em",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 2L12.4 7.8L18.5 8.3L14 12.3L15.4 18.3L10 15.1L4.6 18.3L6 12.3L1.5 8.3L7.6 7.8L10 2Z"
              fill="#F7931A"
            />
          </svg>
          BitRemit
        </Link>

        {/* Mezo badge */}
        <a
          href="https://mezo.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:border-[#F7931A] hover:text-[#F7931A]"
          style={{
            color: "#8B949E",
            background: "#21262D",
            borderColor: "#30363D",
          }}
        >
          ⚡ Built on Mezo Testnet
        </a>

        {/* Disclaimer */}
        <span className="text-xs" style={{ color: "#8B949E" }}>
          Testnet only. No real funds.
        </span>
      </div>
    </footer>
  );
}
