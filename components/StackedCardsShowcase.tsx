"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { PillArrowButton } from "@/components/PillArrowButton";
import { gsap, ScrollTrigger } from "@/lib/gsap-client";

type StackCard = {
  id: string;
  title: string;
  description: string;
  bgClass: string;
  textClass: string;
  imageSrc: string;
  graphicAlt: string;
  href: string;
  isIntro?: boolean;
};

/** Top → bottom im Array = oben→unten im End-Stack (wie Referenz: Salmon, Cream, Teal, Dark). */
const STACK_CARDS: StackCard[] = [
  {
    id: "stack-showcaase-card",
    title: "Unser Blog",
    description: "",
    bgClass: "bg-transparent",
    textClass: "text-black",
    imageSrc: "",
    graphicAlt: "",
    href: "https://bauwerke.org/de/bauwerke-erweitert-die-fuehrung/",
    isIntro: true,
  },
  {
    id: "bauwerke-erweitert-die-fuehrung",
    title: "Daum Architekten erweitert die Führung",
    description:
      "Im Rahmen der kontinuierlichen Weiterentwicklung des Unternehmens wird die Führungsstruktur bei Daum Architekten zum 1. Januar 2026 erweitert: Ronny Möhler (2. v. l.) wurde zum Partner, Raed Albokaie (links) zum Associate Partner und Sebastian Lange (2. v. r.) zum Associate berufen.",
    bgClass: "bg-[#161616]",
    textClass: "text-white",
    imageSrc:
      "https://bauwerke.org/wp-content/uploads/2025/12/251219_BauWerke_Fuehrungsteam-scaled.jpg",
    graphicAlt:
      "Führungsteam von Daum Architekten mit den neuen Führungskräften",
    href: "https://bauwerke.org/de/bauwerke-erweitert-die-fuehrung/",
  },
  {
    id: "bauwerke-exzellenz-preis-2024",
    title: "Verleihung des Daum Architekten Exzellenz-Preises 2024 in Berlin",
    description:
      "Am 4. Dezember wurde der Daum Architekten Exzellenz-Preis für die Absolventen des Fachbereichs Architektur an der Hochschule für Technik und Wirtschaft Berlin (BHT) mit den besten Bachelorarbeiten des Jahrgangs 2023/2024 in feierlichem Rahmen verliehen.",
    bgClass: "bg-[#2A2A2A]",
    textClass: "text-white",
    imageSrc:
      "https://bauwerke.org/wp-content/uploads/2024/11/BW_EP_Plakat_einzeln-scaled.jpg",
    graphicAlt: "Plakat zur Verleihung des Daum Architekten Exzellenz-Preises 2024",
    href: "https://bauwerke.org/de/verleihung-des-bauwerke-exzellenz-preises-2024-in-berlin/",
  },
  {
    id: "die-kalkscheune-wird-wiederbelebt",
    title: "Die „Kalkscheune“ wird wiederbelebt",
    description:
      "Die „Kalkscheune“ – einstige Kultstätte der Berliner Kunst- und Veranstaltungsszene in Berlin-Mitte – wird wiederbelebt:",
    bgClass: "bg-[#3D3D3D]",
    textClass: "text-white",
    imageSrc:
      "https://bauwerke.org/wp-content/uploads/2024/10/B_JS2_Luftaufnahme.jpg",
    graphicAlt: "Luftaufnahme der denkmalgeschützten Kalkscheune in Berlin",
    href: "https://bauwerke.org/de/die-kalkscheune-wird-wiederbelebt/",
  },
];

/** z-index rises with stack order so each new card lays in front of the previous. */
type StackedCardsShowcaseProps = {
  reducedMotion: boolean;
};

function subscribeMdUp(cb: () => void) {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function CardRowLayout({
  card,
  variant,
}: {
  card: StackCard;
  variant: "static" | "animated";
}) {
  const gap =
    variant === "static"
      ? "gap-[clamp(0.85rem,2vw,1.15rem)]"
      : "gap-[clamp(0.65rem,1.8vw,1.1rem)]";
  const titleClass =
    variant === "static"
      ? "text-[clamp(1.22rem,3.45vw,2.25rem)] leading-[1.02]"
      : "text-[clamp(1.28rem,3.85vw,2.5rem)] leading-[0.98]";
  const imgBoxStatic =
    "aspect-[4/3] max-h-[min(52svh,20rem)] md:aspect-auto md:max-h-none md:h-[min(52vw,20rem)] md:w-[min(52vw,20rem)] lg:h-[min(46vw,30rem)] lg:w-[min(46vw,30rem)] xl:h-[min(42vw,34rem)] xl:w-[min(42vw,34rem)]";
  const imgBoxAnimated =
    "aspect-[4/3] max-h-[min(50svh,19rem)] md:aspect-auto md:max-h-none md:h-[min(56vw,22rem)] md:w-[min(56vw,22rem)] lg:h-[min(48vw,32rem)] lg:w-[min(48vw,32rem)] xl:h-[min(44vw,38rem)] xl:w-[min(44vw,38rem)]";

  const row = `flex flex-col justify-start ${gap} md:flex-row md:items-start md:justify-between md:gap-[clamp(1.1rem,2.75vw,2.25rem)]`;
  const isIntro = Boolean(card.isIntro);

  return (
    <div
      className={
        isIntro
          ? "flex h-full w-full items-start justify-center"
          : variant === "animated"
            ? `flex min-h-0 w-full flex-1 ${row}`
            : row
      }
    >
      {isIntro ? (
        <h2
          className={`text-center font-sans text-[clamp(1.7rem,4.2vw,3.35rem)] font-semibold leading-[1.04] tracking-tight ${card.textClass}`}
        >
          {card.title}
        </h2>
      ) : (
        <>
          <div className="shrink-0 space-y-3 md:max-w-[24rem] lg:max-w-[30rem]">
            <h3
              className={`max-w-[18ch] lg:max-w-[24ch] font-sans ${titleClass} font-bold uppercase italic tracking-tight ${card.textClass}`}
            >
              {card.title}
            </h3>
            <p className={`max-w-[34ch] lg:max-w-[44ch] text-sm leading-[1.45] ${card.textClass}/85`}>
              {card.description}
            </p>
          </div>
          <div
            className={`relative w-full max-w-full shrink-0 overflow-hidden rounded-2xl ${
              variant === "static" ? imgBoxStatic : imgBoxAnimated
            }`}
            role="img"
            aria-label={card.graphicAlt}
          >
            <img
              src={card.imageSrc}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </>
      )}
    </div>
  );
}

export function StackedCardsShowcase({ reducedMotion }: StackedCardsShowcaseProps) {
  const rootRef = useRef<HTMLElement>(null);
  const scrollRangeRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const isMdUp = useSyncExternalStore(
    subscribeMdUp,
    () => window.matchMedia("(min-width: 768px)").matches,
    () => true,
  );

  useGSAP(
    () => {
      if (reducedMotion || !isMdUp) return;
      const range = scrollRangeRef.current;
      const stack = stackRef.current;
      if (!range || !stack) return;

      const firstEl = cardRefs.current[0];
      const secondEl = cardRefs.current[1];
      const thirdEl = cardRefs.current[2];
      const fourthEl = cardRefs.current[3];
      if (!firstEl || !secondEl || !thirdEl || !fourthEl) return;

      const cardEls = [firstEl, secondEl, thirdEl, fourthEl];
      const setUnderH3Offset = () => {
        const heading = fourthEl.querySelector("h3, h2");
        if (!heading) return;
        const headingHeight = heading.getBoundingClientRect().height;
        const paddingTop = Number.parseFloat(getComputedStyle(fourthEl).paddingTop) || 0;
        const rawStep = headingHeight + paddingTop + 8;
        const stepPx = Math.min(Math.max(rawStep, 56), 88);
        stack.style.setProperty("--stack-under-h3", `${stepPx}px`);
        const maxOffset = stepPx * (STACK_CARDS.length - 1);
        const safeBottomPad = 16;
        const availablePx = stack.clientHeight - maxOffset - safeBottomPad;
        const cardHeightPx = Math.max(availablePx, 320);
        stack.style.setProperty("--stack-card-height", `${cardHeightPx}px`);
      };
      setUnderH3Offset();
      ScrollTrigger.addEventListener("refreshInit", setUnderH3Offset);

      gsap.set(stack, { force3D: true, willChange: "transform" });
      gsap.set(firstEl, { yPercent: 0, force3D: true, willChange: "transform" });
      gsap.set([secondEl, thirdEl, fourthEl], {
        yPercent: 108,
        force3D: true,
        willChange: "transform",
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none", force3D: true },
        scrollTrigger: {
          trigger: range,
          start: "top 35%",
          end: "bottom bottom",
          scrub: 0.72,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      let t = 0;

      timeline.to(stack, { yPercent: -1.4, duration: 1.1 }, t);
      t += 1.15;

      timeline.to(stack, { yPercent: -5.2, duration: 3.2 }, t);
      timeline.fromTo(secondEl, { yPercent: 108 }, { yPercent: 0, duration: 3.75 }, t + 0.15);
      t += 4.05;

      timeline.to(stack, { yPercent: -9.6, duration: 3.2 }, t);
      timeline.fromTo(thirdEl, { yPercent: 108 }, { yPercent: 0, duration: 3.9 }, t + 0.16);
      t += 4.1;

      timeline.to(stack, { yPercent: -13.8, duration: 3.2 }, t);
      timeline.fromTo(fourthEl, { yPercent: 108 }, { yPercent: 0, duration: 3.95 }, t + 0.18);
      t += 4.2;

      timeline.to(stack, { yPercent: -15.6, duration: 1.2 }, t);

      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", setUnderH3Offset);
        timeline.kill();
        gsap.set([stack, ...cardEls], { clearProps: "willChange" });
      };
    },
    { scope: rootRef, dependencies: [reducedMotion, isMdUp] },
  );

  const cardsDom: StackCard[] = [
    STACK_CARDS[0],
    STACK_CARDS[1],
    STACK_CARDS[2],
    STACK_CARDS[3],
  ];
  const mobileCards = STACK_CARDS.filter((card) => !card.isIntro);

  /* Nur prefers-reduced-motion: komplette statische Section (gleiches Markup wie Mobil). */
  if (reducedMotion) {
    return (
      <section
        ref={rootRef}
        id="projekte-section"
        aria-labelledby="stack-showcase-heading"
        className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(3rem,8vw,6rem)]"
      >
        <h2
          id="stack-showcase-heading"
          className="mx-auto mb-[clamp(0.7rem,2vw,1rem)] w-full max-w-[42rem] px-0 text-left font-sans text-[clamp(1.7rem,4.2vw,3.35rem)] font-semibold leading-[1.04] tracking-tight text-black"
        >
          Unser Blog
        </h2>
        <p className="mx-auto mb-[clamp(1.25rem,3vw,2rem)] max-w-[62ch] text-left text-[clamp(0.9rem,1.6vw,1.05rem)] leading-[1.45] text-black/72">
          Typologisch vielfältige Projekte — von Wohnen und Sanierung bis zu öffentlichen Aufgaben und Wettbewerben.
        </p>
        <div className="mx-auto flex w-full max-w-[42rem] flex-col gap-[clamp(1rem,2.5vw,1.5rem)]">
          {STACK_CARDS.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              id={`stack-showcase-static-${card.id}`}
              aria-label={`${card.title} — zur Übersicht`}
              className={`block overflow-hidden rounded-[clamp(0.95rem,1.8vw,1.45rem)] px-[clamp(0.9rem,2.5vw,1.5rem)] py-[clamp(1rem,2.5vw,1.45rem)] shadow-[0_0.5rem_1.75rem_rgba(0,0,0,0.08)] no-underline outline-offset-2 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${card.bgClass}`}
            >
              <CardRowLayout card={card} variant="static" />
            </Link>
          ))}
        </div>
        <div className="mx-auto mt-[clamp(1.2rem,3vw,2rem)] flex w-full max-w-[42rem] justify-center px-[clamp(1rem,4vw,2.5rem)]">
          <PillArrowButton href="#site-contact-cta-section" label="Projekt anfragen" tone="dark" />
        </div>
      </section>
    );
  }

  return (
    <section ref={rootRef} id="projekte-section" className="relative z-20">
      {/* Mobil: natives Scrollen, volle Karten — kein 520vh/GSAP (keine „Striche“, weniger CPU). */}
      <div className="px-[clamp(1rem,4vw,2.5rem)] pb-[clamp(3rem,8vw,6rem)] pt-[clamp(3rem,8vw,6rem)] md:hidden">
        <h2
          id="stack-showcase-heading"
          className="mx-auto mb-[clamp(0.7rem,2vw,1rem)] w-full max-w-[42rem] px-0 text-left font-sans text-[clamp(1.7rem,4.2vw,3.35rem)] font-semibold leading-[1.04] tracking-tight text-black"
        >
          Unser Blog
        </h2>
        <p className="mx-auto mb-[clamp(1.25rem,3vw,2rem)] max-w-[62ch] text-left text-[clamp(0.9rem,1.6vw,1.05rem)] leading-[1.45] text-black/72">
          Typologisch vielfältige Projekte — von Wohnen und Sanierung bis zu öffentlichen Aufgaben und Wettbewerben.
        </p>
        <div className="mx-auto flex w-full max-w-[42rem] flex-col gap-[clamp(1rem,2.5vw,1.5rem)]">
          {mobileCards.map((card) => (
            <Link
              key={`mobile-${card.id}`}
              href={card.href}
              id={`stack-showcase-mobile-${card.id}`}
              aria-label={`${card.title} — zur Übersicht`}
              className={`block overflow-hidden rounded-[clamp(0.95rem,1.8vw,1.45rem)] px-[clamp(0.9rem,2.5vw,1.5rem)] py-[clamp(1rem,2.5vw,1.45rem)] shadow-[0_0.5rem_1.75rem_rgba(0,0,0,0.08)] no-underline outline-offset-2 transition-opacity active:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${card.bgClass}`}
            >
              <CardRowLayout card={card} variant="static" />
            </Link>
          ))}
        </div>
        <div className="mx-auto mt-[clamp(1.2rem,3vw,2rem)] flex w-full max-w-[42rem] justify-center px-[clamp(1rem,4vw,2.5rem)]">
          <PillArrowButton href="#site-contact-cta-section" label="Projekt anfragen" tone="dark" />
        </div>
      </div>

      {/* Desktop: Scroll-Story + GSAP */}
      <div className="hidden md:block">
        <h2 className="sr-only">Unser Blog</h2>
        <p className="sr-only">
          Typologisch vielfältige Projekte — von Wohnen und Sanierung bis zu öffentlichen Aufgaben und Wettbewerben.
        </p>
        <div
          ref={scrollRangeRef}
          id="stack-showcase-scroll-range"
          className="relative h-[520vh]"
        >
          <div
            id="stack-showcase-sticky-stage"
            className="sticky top-0 h-[112svh] min-h-[112svh] overflow-hidden isolate"
          >
            <div
              ref={stackRef}
              id="stack-showcase-stack"
              className="absolute bottom-0 left-0 right-0 top-[clamp(14vh,20vh,26vh)] flex justify-center px-[clamp(1rem,4vw,2.5rem)] pb-[clamp(0.75rem,3vh,1.5rem)] [--stack-under-h3:clamp(4rem,7vw,5.75rem)] [--stack-card-height:78vh]"
            >
              {cardsDom.map((card, stackIndex) => (
                <Link
                  key={card.id}
                  href={card.href}
                  ref={(node) => {
                    cardRefs.current[stackIndex] = node;
                  }}
                  id={`stack-showcase-card-${card.id}`}
                  aria-label={`${card.title} — zur Übersicht`}
                  className={`absolute flex min-h-0 flex-col overflow-hidden rounded-[clamp(1.25rem,3vw,2.35rem)] px-[clamp(0.95rem,2.75vw,1.85rem)] py-[clamp(1rem,2.75vw,1.65rem)] shadow-[0_0.85rem_2.25rem_rgba(0,0,0,0.12)] no-underline outline-offset-2 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${card.bgClass}`}
                  style={{
                    height: "var(--stack-card-height)",
                    bottom: `calc(${STACK_CARDS.length - 1 - stackIndex} * var(--stack-under-h3))`,
                    left: "clamp(1rem, 4vw, 2.5rem)",
                    right: "clamp(1rem, 4vw, 2.5rem)",
                    zIndex: stackIndex + 1,
                  }}
                >
                  <CardRowLayout card={card} variant="animated" />
                </Link>
              ))}
            </div>
            <div className="absolute bottom-[clamp(1rem,3vh,2rem)] left-0 right-0 z-30 flex justify-center px-[clamp(1rem,4vw,2.5rem)]">
              <PillArrowButton href="#site-contact-cta-section" label="Projekt anfragen" tone="dark" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
