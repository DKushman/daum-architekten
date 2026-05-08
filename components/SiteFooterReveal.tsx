"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { PillArrowButton } from "@/components/PillArrowButton";

export function SiteFooterReveal() {
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    const syncFooterHeight = () => {
      document.documentElement.style.setProperty(
        "--site-footer-reveal-height",
        `${footerEl.offsetHeight}px`,
      );
    };

    syncFooterHeight();
    const resizeObserver = new ResizeObserver(syncFooterHeight);
    resizeObserver.observe(footerEl);
    window.addEventListener("resize", syncFooterHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncFooterHeight);
    };
  }, []);

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      footerEl.style.transform = "translate3d(0, 0px, 0)";
      return;
    }

    const spacerEl = document.getElementById("site-footer-reveal-spacer");
    if (!spacerEl) {
      footerEl.style.transform = "translate3d(0, 0px, 0)";
      return;
    }

    let lastScrollY = window.scrollY;
    let shiftPx = 0;
    let revealOffsetPx = 64;
    let pendingRaf = 0;
    let settleTimer = 0;
    let lastAppliedTransform = "";

    const applyTransform = () => {
      const transform = `translate3d(0, ${revealOffsetPx + shiftPx}px, 0)`;
      if (transform !== lastAppliedTransform) {
        footerEl.style.transform = transform;
        lastAppliedTransform = transform;
      }
    };

    const updateFooterPosition = () => {
      pendingRaf = 0;
      const rect = spacerEl.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const revealStart = viewportH * 1.02;
      const revealEnd = viewportH * 0.02;
      const progress = Math.min(
        1,
        Math.max(0, (revealStart - rect.top) / Math.max(1, revealStart - revealEnd)),
      );
      revealOffsetPx = (1 - progress) * 64;

      const nextY = window.scrollY;
      const delta = nextY - lastScrollY;
      lastScrollY = nextY;

      if (delta < 0) {
        shiftPx = Math.min(26, Math.abs(delta) * 0.62);
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          shiftPx = 0;
          applyTransform();
        }, 180);
      } else {
        shiftPx = Math.max(0, shiftPx - 2.2);
      }

      applyTransform();
    };

    const onScrollOrResize = () => {
      if (pendingRaf) return;
      pendingRaf = window.requestAnimationFrame(updateFooterPosition);
    };

    applyTransform();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.cancelAnimationFrame(pendingRaf);
      window.clearTimeout(settleTimer);
    };
  }, []);

  const navClass =
    "text-white/76 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  return (
    <footer
      ref={footerRef}
      id="site-footer-reveal"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 rounded-tl-[clamp(1rem,2.2vw,1.8rem)] rounded-tr-[clamp(1rem,2.2vw,1.8rem)] bg-[#000000] text-white will-change-transform"
      aria-label="Site footer"
      style={{ transform: "translate3d(0, 64px, 0)" }}
    >
      <div
        id="site-footer-shell"
        className="pointer-events-auto mx-auto w-full max-w-[100rem] overflow-hidden rounded-tl-[clamp(1rem,2.2vw,1.8rem)] rounded-tr-[clamp(1rem,2.2vw,1.8rem)] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(1.2rem,2.8vw,2.2rem)]"
      >
        <div
          id="site-footer-cta-row"
          className="flex flex-col items-start gap-[clamp(0.9rem,2.3vw,1.5rem)] border-b border-white/12 pb-[clamp(1rem,2.4vw,1.8rem)]"
        >
          <p
            id="site-footer-kicker"
            className="max-w-[40ch] font-sans text-[clamp(0.72rem,1vw,0.86rem)] leading-[1.35] text-white/72 md:max-w-[32ch]"
          >
            Daum Architekten PartG mbB, Berlin - Deutschland.
          </p>

          <div className="w-full">
            <PillArrowButton
              id="site-footer-cta-link"
              href="mailto:info@daumarchitekten.com"
              label="E-Mail an Daum Architekten"
              tone="light"
              className="w-full justify-start sm:w-auto"
            />
          </div>
        </div>

        <section
          id="site-footer-meta-row"
          className="mt-[clamp(0.9rem,2vw,1.5rem)] grid grid-cols-1 gap-[clamp(0.8rem,2vw,1.4rem)] text-[clamp(0.72rem,0.98vw,0.84rem)] leading-[1.4] text-white/76 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div id="site-footer-links-col" className="min-w-0">
            <ul className="space-y-[clamp(0.18rem,0.42vw,0.32rem)]">
              <li>
                <Link className={navClass} href="#hero-section">
                  Home
                </Link>
              </li>
              <li>
                <Link className={navClass} href="#projekte-section">
                  Projekte
                </Link>
              </li>
              <li>
                <Link className={navClass} href="#team-section">
                  Team
                </Link>
              </li>
              <li>
                <Link className={navClass} href="#site-contact-cta-section">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          <div id="site-footer-sitemap-col" className="min-w-0">
            <ul className="space-y-[clamp(0.18rem,0.42vw,0.32rem)]">
              <li>
                <a
                  className={navClass}
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className={navClass}
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className={navClass}
                  href="https://www.daumarchitekten.com/datenschutz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutz
                </a>
              </li>
              <li>
                <a
                  className={navClass}
                  href="https://www.daumarchitekten.com/impressum"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Impressum
                </a>
              </li>
            </ul>
          </div>
          <div id="site-footer-contact-col" className="min-w-0 break-words">
            <p className="font-medium text-white">Kontakt:</p>
            <ul className="mt-[clamp(0.22rem,0.5vw,0.35rem)] space-y-[clamp(0.18rem,0.42vw,0.32rem)]">
              <li>info@daumarchitekten.com</li>
              <li>Berlin, Deutschland</li>
            </ul>
          </div>
          <div id="site-footer-social-col" className="min-w-0 break-words">
            <p className="font-medium text-white">Anschrift:</p>
            <ul className="mt-[clamp(0.22rem,0.5vw,0.35rem)] space-y-[clamp(0.18rem,0.42vw,0.32rem)]">
              <li>Daum Architekten PartG mbB</li>
              <li>Berlin | Deutschland</li>
            </ul>
            <p className="mt-[clamp(0.8rem,1.5vw,1.1rem)]">
              © Daum Architekten {new Date().getFullYear()}
            </p>
          </div>
        </section>

        <div
          id="site-footer-brand"
          className="mt-[clamp(1rem,2.3vw,1.8rem)] border-t border-white/10 pt-[clamp(1rem,2.3vw,1.8rem)]"
        >
          <span className="block max-w-[100vw] font-sans font-black uppercase leading-[0.9] tracking-tighter text-white [font-size:clamp(1.75rem,8vw,9.5rem)]">
            DAUM ARCHITEKTEN
          </span>
        </div>
      </div>
    </footer>
  );
}
