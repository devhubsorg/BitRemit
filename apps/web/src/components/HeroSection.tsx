"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const RAILS = [
  { label: "M-Pesa", color: "#22C55E" },
  { label: "GCash", color: "#3B82F6" },
  { label: "MTN MoMo", color: "#A855F7" },
];

export function HeroSection() {
  const { isConnected } = useAccount();
  const [railIndex, setRailIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleStartSendingClick = () => {
    const connectTrigger = document.querySelector<HTMLButtonElement>(
      "button.connect-btn",
    );
    connectTrigger?.click();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setRailIndex((i: number) => (i + 1) % RAILS.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const rail = RAILS[railIndex];

  return (
    <section
      className="relative flex min-h-[88vh] items-center overflow-hidden px-[5%] pb-15 pt-20"
      id="hero"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/flame.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            opacity: 0.22,
            filter: "saturate(1.15)",
          }}
        />
        {/*
        <div
          className="absolute"
          style={{
            top: "-20%",
            left: "-10%",
            width: "70%",
            height: "100%",
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(247,147,26,0.09) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(247,147,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(247,147,26,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse at 40% 50%, black 30%, transparent 70%)",
          }}
        />
        */}
      </div>

      <div
        className="hero-inner mx-auto grid w-full max-w-300 items-center gap-20"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {/* Left column */}
        <div>
          {/* Headline */}
          <h1
            className="mb-5 leading-none tracking-tight text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(48px, 6vw, 80px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
            }}
          >
            Send{" "}
            <em className="not-italic" style={{ color: "#F7931A" }}>
              Bitcoin&apos;s
            </em>
            <br />
            value.
          </h1>

          {/* Cycling subheadline */}
          <div className="relative mb-9 min-h-8 overflow-hidden">
            <p
              className="text-xl font-light transition-[opacity,transform] duration-300"
              style={{
                color: "#8B949E",
                fontWeight: 300,
                fontSize: "20px",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
              }}
            >
              Your family gets cash via{" "}
              <span
                className="font-medium"
                style={{ color: rail.color, transition: "color 0.3s" }}
              >
                {rail.label}
              </span>
            </p>
          </div>

          {/* Copy */}
          <p
            className="mb-10 border-l-2 pl-4 text-sm tracking-[0.01em]"
            style={{
              color: "#8B949E",
              borderColor: "rgba(247,147,26,0.12)",
            }}
          >
            Lock BTC. Borrow MUSD at 1%. Send anywhere.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            {isConnected ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg border-none px-7 py-3.5 text-sm font-bold tracking-[-0.01em] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(247,147,26,0.3)]"
                style={{
                  background: "#F7931A",
                  color: "#0D1117",
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                }}
              >
                Start Sending &nbsp;→
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleStartSendingClick}
                className="flex items-center gap-2 rounded-lg border-none px-7 py-3.5 text-sm font-bold tracking-[-0.01em] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(247,147,26,0.3)]"
                style={{
                  background: "#F7931A",
                  color: "#0D1117",
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Start Sending &nbsp;→
              </button>
            )}
            <a
              href="#how-it-works"
              className="rounded-lg border px-7 py-3.5 text-sm font-normal transition-[border-color,color,transform] duration-150 hover:-translate-y-px hover:border-[#F7931A] hover:text-[#F7931A]"
              style={{
                background: "transparent",
                borderColor: "#30363D",
                color: "#F0F6FC",
                fontSize: "15px",
                fontFamily: "var(--font-sans)",
              }}
            >
              How It Works
            </a>
          </div>
        </div>

        {/* Right column — mock TX visuals */}
        <div
          className="hidden flex-col gap-3 md:flex"
          aria-hidden="true"
          style={{ animation: "fadeInUp 0.8s ease 0.3s both" }}
        >
          {/* TX card 1 */}
          <div
            className="flex items-center justify-between rounded-xl border p-[18px_22px] transition-transform duration-200 hover:translate-x-1"
            style={{
              background: "#161B22",
              borderColor: "#30363D",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(247,147,26,0.04)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold"
                style={{
                  background: "rgba(247,147,26,0.12)",
                  borderColor: "rgba(247,147,26,0.2)",
                  color: "#F7931A",
                  fontFamily: "var(--font-display)",
                }}
              >
                AM
              </div>
              <div>
                <div className="text-sm font-medium text-white">Amara M.</div>
                <div className="mt-0.5 text-xs" style={{ color: "#8B949E" }}>
                  +254 ••• ••5 7621
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-sm font-bold"
                style={{
                  color: "#F7931A",
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                }}
              >
                250 MUSD
              </div>
              <span
                className="mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "#22C55E",
                  borderColor: "rgba(34,197,94,0.2)",
                }}
              >
                M-Pesa
              </span>
            </div>
          </div>

          {/* TX card 2 */}
          <div
            className="flex items-center justify-between rounded-xl border p-[18px_22px] transition-transform duration-200 hover:translate-x-1"
            style={{
              background: "#161B22",
              borderColor: "#30363D",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(247,147,26,0.04)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  borderColor: "rgba(59,130,246,0.2)",
                  color: "#3B82F6",
                  fontFamily: "var(--font-display)",
                }}
              >
                MR
              </div>
              <div>
                <div className="text-sm font-medium text-white">Maria R.</div>
                <div className="mt-0.5 text-xs" style={{ color: "#8B949E" }}>
                  +63 ••• ••8 9102
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-sm font-bold"
                style={{
                  color: "#3B82F6",
                  fontFamily: "var(--font-display)",
                  fontSize: "15px",
                }}
              >
                120 MUSD
              </div>
              <span
                className="mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  color: "#3B82F6",
                  borderColor: "rgba(59,130,246,0.2)",
                }}
              >
                GCash
              </span>
            </div>
          </div>

          {/* SMS confirmation card */}
          <div
            className="rounded-xl border px-5.5 py-4 text-sm"
            style={{
              background: "#21262D",
              borderColor: "#30363D",
              borderTop: "2px solid #22C55E",
              color: "#8B949E",
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: "#22C55E",
                  animation: "blink 1.5s ease-in-out infinite",
                }}
              />
              <span
                className="text-[11px] font-medium uppercase tracking-[0.06em]"
                style={{ color: "#22C55E" }}
              >
                SMS Delivered · 23s
              </span>
            </div>
            <p className="text-sm italic" style={{ color: "#F0F6FC" }}>
              &ldquo;You have received KES 32,500 from M-Pesa. New balance: KES
              34,100.&rdquo;
            </p>
          </div>

          {/* Status line */}
          <div
            className="flex items-center gap-2.5 px-1 text-xs"
            style={{ color: "#8B949E" }}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: "#22C55E" }}
            />
            All 3 rails live · Settlement in under 60 seconds
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
