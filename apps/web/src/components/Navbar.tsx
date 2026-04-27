import Link from "next/link";

export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-90 flex h-16 items-center border-b px-[5%] backdrop-blur-md transition-[top] duration-300"
      style={{
        background: "rgba(13,17,23,0.85)",
        borderColor: "#30363D",
      }}
    >
      <div className="mx-auto flex w-full max-w-300 items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-1.5 no-underline"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "20px",
            color: "#F7931A",
            letterSpacing: "-0.02em",
          }}
        >
          <svg
            width="20"
            height="20"
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

        {/* CTA */}
        <Link
          href="/send"
          className="flex items-center gap-1.5 rounded-lg border-none px-5 py-2.5 text-sm font-medium transition-[opacity,transform] duration-150 hover:opacity-90 hover:-translate-y-px"
          style={{
            background: "#F7931A",
            color: "#0D1117",
            fontFamily: "var(--font-sans)",
          }}
        >
          Connect Wallet
        </Link>
      </div>
    </nav>
  );
}
