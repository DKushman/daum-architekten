"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { gsap } from "@/lib/gsap-client";
import { publicAssetPath } from "@/lib/publicAssetPath";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
};

/** Teammitglieder inkl. Portraits von daumarchitekten.com/team. */
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "britta-daum",
    name: "Britta Daum",
    role: "Dipl.-Ing. Architektin · Gründungspartner",
    imageSrc:
      "https://static.wixstatic.com/media/a32e4f_cf23570599c24315a76e31cdb9ad672b~mv2.jpg/v1/fill/w_342,h_342,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Britta-IMG_0305.jpg",
  },



  {
    id: "daniel-jaramillo",
    name: "Daniel Jaramillo",
    role: "M.A. Architecture · Projektarchitekt Ecuador",
    imageSrc:
      "https://static.wixstatic.com/media/a32e4f_bd56cd525da94884937681a21d9da329~mv2.jpg/v1/fill/w_342,h_342,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/_DSF7282_edited.jpg",
  },
  {
    id: "sidrit-nushi",
    name: "Sidrit Nushi",
    role: "M. Sc. Architektur · Projektarchitekt",
    imageSrc:
      "https://static.wixstatic.com/media/a32e4f_ef8b72f71c394167af6a32921cb2e394~mv2.jpg/v1/fill/w_342,h_342,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Sidrit.jpg",
  },
  {
    id: "reela-nentwich",
    name: "Reela Nentwich",
    role: "M.Sc. Architektur · Projektarchitektin Deutschland",
    imageSrc:
      "https://static.wixstatic.com/media/a32e4f_7a4b7798e65a4cb288449bda341dbf35~mv2.jpg/v1/fill/w_342,h_342,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/reela-bigger-3.jpg",
  },

  {
    id: "mehmet-celal-bayram",
    name: "Mehmet Celal Bayram",
    role: "B.Sc. Architektur · Werkstudent",
    imageSrc:
      "https://static.wixstatic.com/media/a32e4f_3a270d9539304198aba0c00f32dcb1f5~mv2.jpg/v1/fill/w_342,h_342,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/mehmet.jpg",
  },
  {
    id: "ngan-kim",
    name: "Ngan Kim",
    role: "B.A. Architektur · Praktikantin",
    imageSrc:
      "https://static.wixstatic.com/media/a32e4f_b2ac417f9b244c1ea222143f306e9d29~mv2.jpg/v1/fill/w_342,h_342,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/kim.jpg",
  },

  {
    id: "c-b",
    name: "C. B.",
    role: "Dipl.- Design Innenarchitektur · Projektarchitektin",
    imageSrc:
      "https://static.wixstatic.com/media/a32e4f_585d0fdc92064e009117868d7f0bfeb1~mv2.jpg/v1/fill/w_342,h_342,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/christin_team.jpg",
  },
  {
    id: "justus-krause",
    name: "Justus Krause",
    role: "M.A. Architektur · Außendarstellung & Dokumentation",
    imageSrc:
      "https://static.wixstatic.com/media/a32e4f_21486e5c3ffe4d049108c272db19af88~mv2.jpg/v1/fill/w_342,h_342,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/justus_team.jpg",
  },

];

export function TeamSection() {
  const rootRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  const scrollByDirection = useCallback((direction: "prev" | "next") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const factor = direction === "next" ? 1 : -1;
    scroller.scrollBy({
      left: scroller.clientWidth * 0.78 * factor,
      behavior: "smooth",
    });
  }, []);

  useGSAP(
    () => {
      const header = headerRef.current;
      const scroller = scrollerRef.current;
      if (!header || !scroller) return;
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (!cards.length) return;

      const headerItems = header.querySelectorAll(
        "#team-section-kicker, #team-section-heading",
      );
      const headerTween = gsap.fromTo(
        headerItems,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: header,
            start: "top 94%",
            once: true,
          },
        },
      );

      const cardsTween = gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.15,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: scroller,
            start: "top 94%",
            once: true,
          },
        },
      );

      return () => {
        headerTween.kill();
        cardsTween.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="team-section"
      aria-labelledby="team-section-heading"
      className="py-[clamp(2.5rem,7vw,5.5rem)]"
    >
      <div
        ref={headerRef}
        id="team-section-header"
        className="mx-auto flex w-full max-w-[74rem] flex-col items-center justify-center gap-[clamp(0.8rem,2vw,1.6rem)] px-[clamp(1rem,4vw,2.5rem)] text-center"
      >
        <div id="team-section-header-copy" className="mx-auto">
          <span
            id="team-section-kicker"
            className="block font-sans text-[clamp(0.65rem,0.95vw,0.82rem)] font-medium uppercase tracking-[0.2em] text-black/70"
          >
            Team
          </span>
          <h2
            id="team-section-heading"
            className="mt-[clamp(0.55rem,1.3vw,0.95rem)] font-sans text-[clamp(2rem,5vw,4rem)] font-normal leading-[0.98] tracking-tight text-black"
          >
            Menschen hinter den Projekten
          </h2>
        </div>

        <div
          id="team-section-nav"
          className="hidden shrink-0 items-center gap-[clamp(0.35rem,0.9vw,0.7rem)] pt-[clamp(1.1rem,2.8vw,2rem)] md:mx-auto md:flex"
        >
          <button
            id="team-section-nav-prev"
            type="button"
            onClick={() => scrollByDirection("prev")}
            aria-label="Vorherige Teammitglieder"
            className="inline-flex h-[clamp(2rem,3.2vw,2.55rem)] w-[clamp(2rem,3.2vw,2.55rem)] items-center justify-center border border-black/10 bg-white/65 text-black transition-colors duration-300 hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-[clamp(0.9rem,1.5vw,1.1rem)] w-[clamp(0.9rem,1.5vw,1.1rem)]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M14.5 6.5L9 12l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            id="team-section-nav-next"
            type="button"
            onClick={() => scrollByDirection("next")}
            aria-label="Nächste Teammitglieder"
            className="inline-flex h-[clamp(2rem,3.2vw,2.55rem)] w-[clamp(2rem,3.2vw,2.55rem)] items-center justify-center border border-black/10 bg-white/65 text-black transition-colors duration-300 hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-[clamp(0.9rem,1.5vw,1.1rem)] w-[clamp(0.9rem,1.5vw,1.1rem)]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M9.5 6.5L15 12l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative mt-[clamp(1.1rem,2.8vw,2.2rem)]">
        <a
          id="team-section-see-all"
          href="https://www.daumarchitekten.com/team"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-[clamp(1.4rem,5.2vw,3.2rem)] top-0 z-10 inline-block pb-1 font-sans text-xs font-normal text-black no-underline transition-opacity after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-black after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none hover:opacity-70 hover:after:scale-x-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black focus-visible:after:scale-x-100"
        >
          Alle sehen
        </a>
        <div
          ref={scrollerRef}
          id="team-section-scroller"
          className="flex w-full snap-x snap-mandatory gap-[clamp(0.8rem,2vw,1.4rem)] overflow-x-auto px-[clamp(1.4rem,5.2vw,3.2rem)] pb-[clamp(0.2rem,0.8vw,0.4rem)] pt-[clamp(1.5rem,2.8vw,2rem)] [scroll-padding-inline:clamp(1.4rem,5.2vw,3.2rem)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {TEAM_MEMBERS.map((member, index) => (
          <article
            key={member.id}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            id={`team-section-card-${member.id}`}
            className="group relative min-w-[clamp(16rem,31vw,24rem)] flex-1 snap-start"
          >
            <p
              id={`team-section-card-name-${member.id}`}
              className="sr-only"
            >
              {member.name}
            </p>

            <div
              id={`team-section-card-image-wrap-${member.id}`}
              className="relative aspect-square w-full overflow-hidden rounded-[clamp(1rem,2vw,1.6rem)] bg-[#d9dadd]"
            >
              <img
                id={`team-section-card-image-${member.id}`}
                src={publicAssetPath(member.imageSrc)}
                alt={`Porträt von ${member.name}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full origin-center object-cover object-top transform-gpu transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.1]"
              />

              <div
                id={`team-section-card-overlay-${member.id}`}
                className="absolute inset-x-[clamp(0.45rem,0.9vw,0.7rem)] bottom-[clamp(0.45rem,0.9vw,0.7rem)] flex items-center justify-between gap-[clamp(0.45rem,0.95vw,0.7rem)] rounded-[clamp(0.62rem,1.1vw,0.85rem)] border border-black/8 bg-white/95 px-[clamp(0.55rem,1.05vw,0.78rem)] py-[clamp(0.42rem,0.85vw,0.62rem)] shadow-[0_0.4rem_1rem_rgba(0,0,0,0.08)] backdrop-blur-[2px]"
              >
                <div id={`team-section-card-overlay-copy-${member.id}`} className="min-w-0">
                  <p
                    id={`team-section-card-overlay-name-${member.id}`}
                    className="truncate font-sans text-[clamp(0.78rem,0.98vw,0.9rem)] font-semibold leading-[1.15] text-black"
                  >
                    {member.name}
                  </p>
                  <p
                    id={`team-section-card-role-${member.id}`}
                    className="mt-[clamp(0.12rem,0.28vw,0.2rem)] truncate font-sans text-[clamp(0.62rem,0.82vw,0.74rem)] leading-[1.2] text-black/70"
                  >
                    {member.role}
                  </p>
                </div>

                <Link
                  id={`team-section-card-overlay-link-${member.id}`}
                  href="#site-contact-cta-section"
                  aria-label={`Kontakt zu ${member.name}`}
                  className="inline-flex h-[clamp(1.35rem,1.85vw,1.62rem)] w-[clamp(1.35rem,1.85vw,1.62rem)] shrink-0 items-center justify-center rounded-full border border-black/12 bg-white text-black/75 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-[-45deg]"
                >
                  <svg
                    id={`team-section-card-overlay-link-icon-${member.id}`}
                    viewBox="0 0 24 24"
                    className="h-[clamp(0.62rem,0.95vw,0.82rem)] w-[clamp(0.62rem,0.95vw,0.82rem)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
          ))}
        </div>
      </div>
    </section>
  );
}
