"use client";

import { useGSAP } from "@gsap/react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-client";
import {
  HERO_EYEBROW_IN_DURATION_S,
  HERO_FIGURE_IN_DURATION_S,
  HERO_FIGURE_OFFSET_S,
} from "@/lib/heroRevealTiming";
import { publicAssetPath } from "@/lib/publicAssetPath";
import { HeroHeadline } from "@/components/HeroHeadline";
import { IntroPreloader } from "@/components/IntroPreloader";
import { SiteHeader } from "@/components/SiteHeader";
// import { StackedCardsShowcase } from "@/components/StackedCardsShowcase";
import { TeamSection } from "@/components/TeamSection";
import { SiteFooterReveal } from "@/components/SiteFooterReveal";
import { ContactCtaSection } from "@/components/ContactCtaSection";
import { PillArrowButton } from "@/components/PillArrowButton";

/** Sticky cards: Inhalte/Bilder aus ausgewählten Projektseiten von daumarchitekten.com. */
const PROJECT_IMAGES = {
  anklamerStrasse:
    "https://static.wixstatic.com/media/a32e4f_a205ec512d7640348097267f2a591793~mv2.jpg",
  torstrasse:
    "https://static.wixstatic.com/media/a32e4f_cac4ae1c1aa74d8eb9918715ea199fce~mv2.jpg",
  kantstrasse:
    "https://static.wixstatic.com/media/a32e4f_67193c58015f4e35a557231cee694e2c~mv2.jpg",
  matterhornstrasse:
    "https://static.wixstatic.com/media/a32e4f_47920c7201574135b401fd0735b7c22f~mv2.jpg",
} as const;

/** Hero: Daum Architekten Referenzmotiv. */
const HERO_IMAGE_SRC = publicAssetPath("https://static.wixstatic.com/media/a32e4f_04446c253c324448961d7bf14bd557e5~mv2.jpg/v1/fill/w_1080,h_1080,al_c,q_85,enc_avif,quality_auto/a32e4f_04446c253c324448961d7bf14bd557e5~mv2.jpg");
/** Alias — gleiche URL wie `HERO_IMAGE_SRC` (<picture>/<source>). */
const MOBILE_HERO_SRC = HERO_IMAGE_SRC;

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

type StickyStoryStep = {
  id: string;
  step: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

type ProfilPillar = {
  id: string;
  title: string;
  description: string;
  iconTitle: string;
  iconPaths: string[];
};

/** Projekt-Highlights aus vier konkreten daumarchitekten.com Projektseiten. */
const STICKY_STORY_STEPS: StickyStoryStep[] = [
  {
    id: "314-anklamer-strasse",
    step: "01",
    title: "314_Anklamer Straße",
    description:
      "Sanierung und Umbau eines Industriegeschosses zu einem Wohnloft mit puristischem Berlin-Charme, wiederverwendeten historischen Elementen und industriellen Details.",
    imageSrc: PROJECT_IMAGES.anklamerStrasse,
    imageAlt: "Projekt 314_Anklamer Straße von Daum Architekten.",
  },
  {
    id: "354-torstrasse",
    step: "02",
    title: "354_Torstraße",
    description:
      "Entwurf eines Loftumbaus mit entferntem Trennwandsystem und einem hängenden Bücherregal als räumlichem Filter zwischen Arbeits- und Wohnbereich.",
    imageSrc: PROJECT_IMAGES.torstrasse,
    imageAlt: "Projekt 354_Torstraße von Daum Architekten.",
  },
  {
    id: "298-kantstrasse",
    step: "03",
    title: "298_Kantstraße",
    description:
      "Ausbau des Dachgeschosses im Hinterhaus und Seitenflügel mit Aufzugsanbau sowie Realisierung flexibel nutzbarer Büroeinheiten mit möglicher Loft-Umnutzung.",
    imageSrc: PROJECT_IMAGES.kantstrasse,
    imageAlt: "Projekt 298_Kantstraße von Daum Architekten.",
  },
  {
    id: "381-matterhornstrasse",
    step: "04",
    title: "381_Matterhornstraße",
    description:
      "Komplettsanierung eines historischen Landhauses mit behutsamer Transformation, räumlicher Neuordnung und technischer Erneuerung inklusive PV, Wärmepumpe und KNX.",
    imageSrc: PROJECT_IMAGES.matterhornstrasse,
    imageAlt: "Projekt 381_Matterhornstraße von Daum Architekten.",
  },
];

const STUDIO_PROFIL_PILLARS: ProfilPillar[] = [
  {
    id: "neugier",
    title: "Bestand mit Zukunft",
    description:
      "Wir transformieren Bestand präzise und respektvoll, damit Architektur langfristig nutzbar, wertig und lebendig bleibt.",
    iconTitle: "Vielfalt",
    iconPaths: [
      "M12 12m-7.5 0a7.5 7.5 0 1 0 15 0a7.5 7.5 0 1 0 -15 0",
      "M8.8 14.2c.9 1.5 2 2.3 3.2 2.3s2.3-.8 3.2-2.3",
      "M9.4 10.2h.01",
      "M14.6 10.2h.01",
    ],
  },
  {
    id: "zukunft",
    title: "Klare Entwurfshaltung",
    description:
      "Reduzierte Formensprache, sorgfältige Proportionen und materialgerechte Details bilden den Kern unserer Entwurfsarbeit.",
    iconTitle: "Zukunft",
    iconPaths: [
      "M6.5 4.5h8l3 3v11h-11z",
      "M14.5 4.5v3h3",
      "M8.8 11.3l2.2 2.2l4.2-4.2",
    ],
  },
  {
    id: "nachhaltigkeit",
    title: "Nachhaltig gedacht",
    description:
      "Nachhaltigkeit verstehen wir ganzheitlich - ökologisch, funktional und kulturell - vom Konzept bis in die Realisierung.",
    iconTitle: "Nachhaltigkeit",
    iconPaths: [
      "M12 4.5s-5.6 2.2-7.5 4.3c0 5.2 3.3 8.6 7.5 10.7c4.2-2.1 7.5-5.5 7.5-10.7C17.6 6.7 12 4.5 12 4.5z",
      "M9.4 12.2l1.7 1.7l3.5-3.5",
    ],
  },
  {
    id: "flexibel",
    title: "Räume mit Haltung",
    description:
      "Wir entwickeln Räume, die zugleich klar organisiert und atmosphärisch sind - für Wohnen, Arbeiten und öffentliche Nutzungen.",
    iconTitle: "Flexibilität",
    iconPaths: [
      "M12 4v8l5.2 3",
      "M12 20m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0",
    ],
  },
  {
    id: "robust",
    title: "Sorgfalt im Detail",
    description:
      "Von Materialübergängen bis Lichtführung entstehen durch präzise Detaillierung robuste und zeitlose Architekturen.",
    iconTitle: "Material",
    iconPaths: [
      "M7 7h.01",
      "M17 7h.01",
      "M7 17h.01",
      "M17 17h.01",
      "M8.8 8.8l6.4 6.4",
      "M15.2 8.8l-6.4 6.4",
    ],
  },
  {
    id: "aesthetik",
    title: "Berliner Kontext",
    description:
      "Unsere Projekte reagieren auf den Ort, den städtischen Maßstab und die Geschichte des Bestands - mit zeitgemäßen Lösungen.",
    iconTitle: "Ästhetik",
    iconPaths: [
      "M12 3.5l2.6 5.2l5.7.8l-4.1 4l1 5.7L12 16.4l-5.2 2.8l1-5.7l-4.1-4l5.7-.8z",
    ],
  },
];

const CHARACTERISTICS_DESKTOP_CARD_SIZE_CLASSES = [
  "h-auto w-full",
  "h-auto w-full",
  "h-auto w-full",
  "h-auto w-full",
  "h-auto w-full",
  "h-auto w-full",
] as const;

const CHARACTERISTICS_DESKTOP_CARD_Z = [42, 40, 46, 44, 43, 39] as const;

const CHARACTERISTICS_GRID_AREA_CLASSES = [
  "col-span-1 row-auto md:col-[1/5] md:row-[1/4]",
  "col-span-1 row-auto md:col-[2/5] md:row-[4/7]",
  "col-span-1 row-auto md:col-[5/9] md:row-[2/7]",
  "col-span-1 row-auto md:col-[9/12] md:row-[4/7]",
  "col-span-1 row-auto md:col-[9/13] md:row-[7/10]",
  "col-span-1 row-auto md:col-[6/9] md:row-[7/10]",
] as const;

export function LandingPage() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const [introDone, setIntroDone] = useState(false);
  const eyebrowRef = useRef<HTMLHeadingElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const figureZoomRef = useRef<HTMLPictureElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const [chromeRevealDone, setChromeRevealDone] = useState(false);
  const stickyStoryRangeRef = useRef<HTMLDivElement>(null);
  const stickyStoryBackgroundRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stickyStoryCardHeadingRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stickyStoryCardImageRefs = useRef<Array<HTMLElement | null>>([]);
  const stickyStoryCardDescriptionRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const characteristicsRangeRef = useRef<HTMLDivElement>(null);
  const characteristicsCardRefs = useRef<Array<HTMLElement | null>>([]);

  const handleIntroDone = useCallback(() => {
    setIntroDone(true);
  }, []);

  const revealHeadline = introDone || reducedMotion;

  useGSAP(
    () => {
      if (!introDone || reducedMotion) return;
      const eyebrow = eyebrowRef.current;
      const figure = figureRef.current;
      const figureZoom = figureZoomRef.current;
      if (!eyebrow || !figure || !figureZoom) return;

      gsap.set([eyebrow, figure, figureZoom], {
        force3D: true,
        transformPerspective: 1000,
        willChange: "transform,opacity",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out", force3D: true },
        onComplete: () => setChromeRevealDone(true),
      });

      tl.fromTo(
        eyebrow,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: HERO_EYEBROW_IN_DURATION_S },
        0,
      );
      tl.fromTo(
        figure,
        {
          clipPath: "inset(0 50% 0 50%)",
          WebkitClipPath: "inset(0 50% 0 50%)",
        },
        {
          clipPath: "inset(0 0% 0 0%)",
          WebkitClipPath: "inset(0 0% 0 0%)",
          duration: HERO_FIGURE_IN_DURATION_S,
        },
        HERO_FIGURE_OFFSET_S,
      );
      tl.fromTo(
        figureZoom,
        { scale: 1.032, transformOrigin: "50% 50%", z: 0.01 },
        {
          scale: 1,
          z: 0,
          duration: HERO_FIGURE_IN_DURATION_S,
          ease: "heroFigureReveal",
        },
        HERO_FIGURE_OFFSET_S,
      );
      tl.set([eyebrow, figure, figureZoom], { clearProps: "willChange" });

      return () => {
        tl.kill();
      };
    },
    { dependencies: [introDone, reducedMotion] },
  );

  useGSAP(
    () => {
      if (!introDone || reducedMotion) return;
      const copy = copyRef.current;
      if (!copy) return;

      const split = SplitText.create(copy, {
        type: "words,lines",
        mask: "words",
        aria: "auto",
      });
      gsap.set(split.words, { yPercent: 100, autoAlpha: 0, force3D: true });

      const tween = gsap.to(split.words, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.74,
        stagger: 0.03,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: copy,
          start: "top 85%",
          once: true,
        },
      });

      return () => {
        tween.kill();
        split.revert();
      };
    },
    { dependencies: [introDone, reducedMotion] },
  );

  useGSAP(
    () => {
      if (reducedMotion) return;
      const storyRange = stickyStoryRangeRef.current;
      if (!storyRange) return;

      const backgroundElements = STICKY_STORY_STEPS.map(
        (_, index) => stickyStoryBackgroundRefs.current[index],
      );
      const cardHeadingElements = STICKY_STORY_STEPS.map(
        (_, index) => stickyStoryCardHeadingRefs.current[index],
      );
      const cardImageElements = STICKY_STORY_STEPS.map(
        (_, index) => stickyStoryCardImageRefs.current[index],
      );
      const cardDescriptionElements = STICKY_STORY_STEPS.map(
        (_, index) => stickyStoryCardDescriptionRefs.current[index],
      );
      if (
        backgroundElements.some((item) => !item) ||
        cardHeadingElements.some((item) => !item) ||
        cardImageElements.some((item) => !item) ||
        cardDescriptionElements.some((item) => !item)
      ) {
        return;
      }

      const backgrounds = backgroundElements as HTMLDivElement[];
      const backgroundImageElements = backgrounds.map((item) =>
        item.querySelector("img"),
      );
      if (backgroundImageElements.some((item) => !item)) return;
      const backgroundImages = backgroundImageElements as HTMLImageElement[];
      const cardHeadings = cardHeadingElements as HTMLDivElement[];
      const cardImages = cardImageElements as HTMLElement[];
      const cardDescriptions = cardDescriptionElements as HTMLParagraphElement[];

      gsap.set(backgrounds, {
        yPercent: 108,
        force3D: true,
        willChange: "transform",
      });
      gsap.set(backgrounds[0], { yPercent: 0 });
      gsap.set(backgroundImages, {
        yPercent: 0,
        scale: 1.02,
        force3D: true,
        willChange: "transform",
      });
      gsap.set([cardHeadings, cardDescriptions], {
        yPercent: 110,
        force3D: true,
        willChange: "transform",
      });
      gsap.set(cardImages, {
        yPercent: 108,
        force3D: true,
        willChange: "transform",
      });
      gsap.set([cardHeadings[0], cardImages[0], cardDescriptions[0]], { yPercent: 0 });

      const timeline = gsap.timeline({
        defaults: {
          duration: 0.9,
          ease: "power1.out",
          force3D: true,
        },
        scrollTrigger: {
          trigger: storyRange,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.12,
          fastScrollEnd: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      for (let index = 0; index < STICKY_STORY_STEPS.length - 1; index += 1) {
        timeline
          .to(
            backgrounds[index],
            {
              yPercent: 0,
              ease: "none",
            },
            index,
          )
          .to(
            backgroundImages[index],
            {
              yPercent: -14,
              scale: 1.06,
              ease: "none",
            },
            index,
          )
          .to(
            backgrounds[index + 1],
            {
              yPercent: 0,
            },
            index,
          )
          .to(
            backgroundImages[index + 1],
            {
              yPercent: 0,
              scale: 1.02,
              ease: "none",
            },
            index,
          )
          .to(
            cardHeadings[index],
            {
              yPercent: -110,
            },
            index,
          )
          .to(
            cardHeadings[index + 1],
            {
              yPercent: 0,
            },
            index,
          )
          .to(
            cardImages[index],
            {
              yPercent: -10,
              ease: "none",
            },
            index,
          )
          .to(
            cardImages[index + 1],
            {
              yPercent: 0,
            },
            index,
          )
          .to(
            cardDescriptions[index],
            {
              yPercent: -110,
            },
            index,
          )
          .to(
            cardDescriptions[index + 1],
            {
              yPercent: 0,
            },
            index,
          );
      }

      ScrollTrigger.refresh();

      return () => {
        timeline.kill();
        gsap.set(
          [
            ...backgrounds,
            ...backgroundImages,
            ...cardHeadings,
            ...cardImages,
            ...cardDescriptions,
          ],
          { clearProps: "willChange" },
        );
      };
    },
    { dependencies: [reducedMotion] },
  );

  useGSAP(
    () => {
      if (reducedMotion) return;
      const range = characteristicsRangeRef.current;
      if (!range) return;

      const cardElements = STUDIO_PROFIL_PILLARS.map(
        (_, index) => characteristicsCardRefs.current[index],
      );
      if (cardElements.some((item) => !item)) return;
      const cards = cardElements as HTMLElement[];

      gsap.set(cards, {
        autoAlpha: 0,
        scale: 0.94,
        xPercent: 0,
        yPercent: 18,
        willChange: "transform,opacity",
        force3D: true,
      });

      const entranceOffsets = [
        { xPercent: -165, yPercent: 0 },
        { xPercent: -150, yPercent: 0 },
        { xPercent: -120, yPercent: 0 },
        { xPercent: 150, yPercent: 0 },
        { xPercent: 165, yPercent: 0 },
        { xPercent: 120, yPercent: 0 },
      ];

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
          force3D: true,
        },
        scrollTrigger: {
          trigger: range,
          start: "top 88%",
          end: "bottom bottom",
          scrub: 0.12,
          invalidateOnRefresh: true,
        },
      });
      cards.forEach((card, index) => {
        const offset = entranceOffsets[index];
        timeline.fromTo(
          card,
          {
            autoAlpha: 0,
            xPercent: offset?.xPercent ?? 0,
            yPercent: offset?.yPercent ?? 110,
            scale: 0.96,
          },
          {
            autoAlpha: 1,
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            duration: 0.62,
          },
          0.03 * index,
        );
      });

      ScrollTrigger.refresh();

      return () => {
        timeline.kill();
        gsap.set(cards, { clearProps: "willChange" });
      };
    },
    { dependencies: [reducedMotion] },
  );

  const hideChrome =
    !reducedMotion && !chromeRevealDone;

  return (
    <>
      <IntroPreloader skip={reducedMotion} onIntroReady={handleIntroDone} />

      <SiteHeader
        contactHref="mailto:office@daumarchitekten.com"
        introDone={introDone}
        reducedMotion={reducedMotion}
      />

      <main
        id="main-content"
        aria-busy={!introDone && !reducedMotion}
        className="relative z-10 flex min-h-screen flex-col rounded-bl-[clamp(1rem,2.2vw,1.8rem)] rounded-br-[clamp(1rem,2.2vw,1.8rem)] bg-white text-black"
      >
        <section
          id="hero-section"
          aria-labelledby="hero-headline"
          className="flex min-h-[100vh] flex-col bg-white pb-[clamp(3rem,8vw,6rem)] text-black"
        >
          <div
            id="hero-section-content"
            className="flex min-h-[100vh] flex-col px-[clamp(1rem,4vw,2.5rem)] pb-[clamp(1rem,2.5vw,1.75rem)] pt-[clamp(4.5rem,10vw,6.5rem)]"
          >
            <div className="flex min-h-0 flex-1 flex-col justify-between">
              <div id="hero-section-top" className="flex min-h-0 flex-1 flex-col">
                <h1
                  ref={eyebrowRef}
                  id="hero-eyebrow"
                  className={
                    "mb-[clamp(1rem,3vw,1.75rem)] max-w-prose font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-black " +
                    (hideChrome ? "opacity-0" : "")
                  }
                >
                  Daum Architekten - Berlin
                </h1>

                <figure
                  ref={figureRef}
                  id="hero-figure"
                  className={
                    "relative min-h-0 w-full flex-1 overflow-hidden [contain:paint] " +
                    (hideChrome ? "[clip-path:inset(0_50%_0_50%)] [webkit-clip-path:inset(0_50%_0_50%)]" : "")
                  }
                >
                  <picture
                    ref={figureZoomRef}
                    id="hero-figure-zoom"
                    className="absolute inset-0 block h-full w-full origin-center [transform:translateZ(0)]"
                  >
                    <source media="(max-width: 767px)" srcSet={MOBILE_HERO_SRC} />
                    <img
                      id="hero-image"
                      src={HERO_IMAGE_SRC}
                      alt="Impression aus dem Leistungsspektrum von STUDIO MARS Berlin – Architektur in Berlin."
                      className="block h-full w-full object-cover object-center"
                      loading="eager"
                      decoding="async"
                    />
                  </picture>
                </figure>
              </div>

              <div
                id="hero-section-headline"
                className="mt-[clamp(1rem,2.5vw,1.5rem)] shrink-0"
              >
                <HeroHeadline
                  reveal={revealHeadline}
                  reducedMotion={reducedMotion}
                />
              </div>
            </div>
          </div>

          <p
            ref={copyRef}
            id="hero-section-copy"
            className="split ml-auto px-[clamp(1rem,4vw,2.5rem)] pb-[clamp(1rem,2.5vw,1.75rem)] pt-[clamp(1.5rem,4vw,3rem)] lg:pt-[clamp(3.5rem,7vw,6rem)] max-w-[30ch] text-left font-sans text-[clamp(1.5rem,3.4vw,3.3rem)] leading-[1.08] tracking-tight text-black"
          >
            Daum Architekten verbindet präzise Planung mit poetischer
            Raumwirkung - von der ersten Idee bis zur gebauten Architektur, die
            Orte mit Charakter schafft.
          </p>
        </section>

        {reducedMotion ? (
          <section
            id="sticky-services-section"
            aria-labelledby="sticky-services-heading"
            className="bg-white px-[clamp(1rem,4vw,2.5rem)] py-[clamp(3rem,8vw,6rem)]"
          >
            <h2
              id="sticky-services-heading"
              className="mb-[clamp(1rem,2.5vw,1.8rem)] text-left font-sans text-[clamp(0.72rem,1vw,0.9rem)] font-medium uppercase tracking-[0.2em] text-black"
            >
              Unsre letzten Projekte
            </h2>
            <div id="sticky-services-list" className="mx-auto flex w-full max-w-[70rem] flex-col gap-[clamp(1.5rem,4vw,3rem)]">
              {STICKY_STORY_STEPS.map((step) => (
                <article
                  key={step.id}
                  id={`sticky-services-list-item-${step.id}`}
                  className="overflow-hidden rounded-[clamp(1rem,2vw,1.6rem)] bg-white"
                >
                  <figure id={`sticky-services-list-image-wrap-${step.id}`} className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      id={`sticky-services-list-image-${step.id}`}
                      src={publicAssetPath(step.imageSrc)}
                      alt={step.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 70rem"
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                  </figure>
                  <div id={`sticky-services-list-content-${step.id}`} className="p-[clamp(1rem,3vw,2rem)]">
                    <p className="font-sans text-[clamp(0.95rem,2.2vw,1.3rem)] leading-none text-black/60">
                      {step.step}
                    </p>
                    <h3 className="mt-[clamp(0.45rem,1.2vw,0.75rem)] font-sans text-[clamp(1.4rem,3.4vw,2.6rem)] leading-[1.05] text-black">
                      {step.title}
                    </h3>
                    <p className="mt-[clamp(0.9rem,2vw,1.35rem)] max-w-[36ch] font-sans text-[clamp(1rem,2vw,1.25rem)] leading-[1.35] text-black/85">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mx-auto mt-[clamp(1.4rem,3vw,2.2rem)] flex w-full max-w-[70rem] justify-center">
              <PillArrowButton
                id="sticky-services-cta-link-reduced"
                href="mailto:studio@mars-berlin.com"
                label="Kontakt aufnehmen"
                tone="dark"
              />
            </div>
          </section>
        ) : (
          <section
            id="sticky-services-section"
            aria-labelledby="sticky-services-heading"
            className="relative bg-white py-[clamp(3rem,8vw,6rem)]"
          >
            <h2
              id="sticky-services-heading"
              className="px-[clamp(1rem,4vw,2.5rem)] pb-[clamp(1rem,2.5vw,1.8rem)] text-left font-sans text-[clamp(0.72rem,1vw,0.9rem)] font-medium uppercase tracking-[0.2em] text-black"
            >
              Unsere letzten Projekte
            </h2>

            <div
              ref={stickyStoryRangeRef}
              id="sticky-services-scroll-range"
              className="relative h-[400vh]"
            >
              <div id="sticky-services-stage" className="sticky top-0 h-screen overflow-hidden">
                <div
                  id="sticky-services-background-stage"
                  className="absolute inset-x-[clamp(1rem,4vw,2.5rem)] top-[clamp(0.75rem,2vw,1.5rem)] bottom-[clamp(0.75rem,2vw,1.5rem)]"
                >
                  {STICKY_STORY_STEPS.map((step, index) => (
                    <div
                      key={step.id}
                      ref={(node) => {
                        stickyStoryBackgroundRefs.current[index] = node;
                      }}
                      id={`sticky-services-background-${step.id}`}
                      className="absolute inset-0 overflow-hidden rounded-[clamp(1rem,2.2vw,2rem)]"
                      style={{ zIndex: index + 1 }}
                    >
                      <Image
                        id={`sticky-services-background-image-${step.id}`}
                        src={publicAssetPath(step.imageSrc)}
                        alt={step.imageAlt}
                        fill
                        sizes="100vw"
                        className="h-full w-full object-cover object-center [contain:paint]"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>

                <div
                  id="sticky-services-card-stage"
                  className="absolute inset-0 z-20 flex items-center justify-center px-[clamp(1rem,4vw,2.5rem)]"
                >
                  <article
                    id="sticky-services-card-stack"
                    className="relative isolate h-fit overflow-hidden rounded-[clamp(1rem,2.2vw,2rem)] border border-black/5 bg-white p-[clamp(1rem,3vw,2rem)] shadow-[0_1.25rem_3.5rem_rgba(0,0,0,0.2)]"
                    style={{
                      width: "min(88vw, clamp(18rem, 38vw, 34rem))",
                    }}
                  >
                    <div
                      id="sticky-services-card-content-underlay"
                      className="absolute inset-0 z-0 bg-white"
                      aria-hidden="true"
                    />
                    <div id="sticky-services-card-content-viewport" className="relative z-10 h-full w-full">
                      <div
                        id="sticky-services-card-heading-viewport"
                        className="relative h-[clamp(5.75rem,18vw,8.5rem)] overflow-hidden"
                      >
                        {STICKY_STORY_STEPS.map((step, index) => (
                          <div
                            key={step.id}
                            ref={(node) => {
                              stickyStoryCardHeadingRefs.current[index] = node;
                            }}
                            id={`sticky-services-card-heading-${step.id}`}
                            className="absolute inset-0 flex flex-col [contain:paint]"
                            style={{ zIndex: 20 + index + 1 }}
                          >
                            <p
                              id={`sticky-services-card-step-${step.id}`}
                              className="text-center font-sans text-[clamp(1.35rem,2.5vw,2rem)] font-light leading-none tracking-tight text-black/70"
                            >
                              {step.step}
                            </p>
                            <h3
                              id={`sticky-services-card-title-${step.id}`}
                              className="mt-[clamp(0.25rem,0.75vw,0.55rem)] text-center font-sans text-[clamp(1.45rem,3vw,2.35rem)] font-normal leading-[1] tracking-tight text-black"
                            >
                              {step.title}
                            </h3>
                          </div>
                        ))}
                      </div>

                      <div
                        id="sticky-services-card-image-viewport"
                        className="relative mt-[clamp(0.75rem,1.6vw,1.2rem)] h-[clamp(10rem,52vw,19rem)] overflow-hidden rounded-[clamp(0.8rem,1.7vw,1.4rem)]"
                      >
                        {STICKY_STORY_STEPS.map((step, index) => (
                          <figure
                            key={step.id}
                            ref={(node) => {
                              stickyStoryCardImageRefs.current[index] = node;
                            }}
                            id={`sticky-services-card-image-wrap-${step.id}`}
                            className="absolute inset-0 overflow-hidden [contain:paint]"
                            style={{ zIndex: 30 + index + 1 }}
                          >
                            <Image
                              id={`sticky-services-card-image-${step.id}`}
                              src={publicAssetPath(step.imageSrc)}
                              alt={step.imageAlt}
                              fill
                              sizes="(max-width: 1024px) 85vw, 32rem"
                              className="h-full w-full object-cover object-center"
                              loading={index === 0 ? "eager" : "lazy"}
                            />
                          </figure>
                        ))}
                      </div>

                      <div
                        id="sticky-services-card-description-viewport"
                        className="relative mt-[clamp(0.75rem,1.6vw,1.2rem)] h-[clamp(6.2rem,19vw,8.2rem)] overflow-hidden"
                      >
                        {STICKY_STORY_STEPS.map((step, index) => (
                          <p
                            key={step.id}
                            ref={(node) => {
                              stickyStoryCardDescriptionRefs.current[index] = node;
                            }}
                            id={`sticky-services-card-description-${step.id}`}
                            className="absolute inset-0 max-w-[33ch] font-sans text-[clamp(0.85rem,1.2vw,1.05rem)] leading-[1.28] text-black/85 [contain:paint]"
                            style={{ zIndex: 40 + index + 1 }}
                          >
                            {step.description}
                          </p>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-[clamp(1.1rem,2.5vw,1.8rem)] flex w-full max-w-[70rem] justify-center px-[clamp(1rem,4vw,2.5rem)]">
              <PillArrowButton
                id="sticky-services-cta-link"
                href="mailto:studio@mars-berlin.com"
                label="Kontakt aufnehmen"
                tone="dark"
              />
            </div>
          </section>
        )}

        {reducedMotion ? (
          <section
            id="profil-section-section"
            aria-labelledby="profil-section-heading"
            className="relative z-30 bg-white px-[clamp(1rem,4vw,2.5rem)] py-[clamp(3rem,8vw,6rem)]"
          >
            <header
              id="profil-section-header"
              className="mx-auto flex w-full max-w-[74rem] flex-col items-center text-center"
            >
              <h2
                id="profil-section-heading"
                className="font-sans text-[clamp(1.7rem,4.2vw,3.35rem)] font-semibold leading-[1.04] tracking-tight text-black"
              >
                Profil von Daum Architekten
              </h2>
              <p
                id="profil-section-intro"
                className="mx-auto mt-[clamp(0.8rem,2vw,1.4rem)] max-w-[62ch] font-sans text-[clamp(0.95rem,1.5vw,1.12rem)] leading-[1.45] text-black/80"
              >
                Daum Architekten entwickelt Umbau-, Sanierungs- und Neubauprojekte mit einem klaren Fokus auf Bestand, Präzision und zeitlose Materialität.
              </p>
            </header>

            <div
              id="profil-section-grid"
              className="mx-auto mt-[clamp(1.6rem,4vw,2.8rem)] grid w-full max-w-[74rem] grid-cols-2 gap-[clamp(0.8rem,2vw,1.4rem)] md:grid-cols-3"
            >
              {STUDIO_PROFIL_PILLARS.map((item) => {
                return (
                  <article
                    key={item.id}
                    id={`profil-section-card-${item.id}`}
                    className="group relative overflow-hidden rounded-[clamp(0.9rem,2vw,1.4rem)] border border-black/10 bg-white p-[clamp(0.9rem,2vw,1.25rem)] transition-[transform,box-shadow,background-color,border-color] duration-650 ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:-translate-y-[0.16rem] md:hover:border-black/40 md:hover:bg-black md:hover:shadow-[0_0.95rem_2.1rem_rgba(0,0,0,0.16)]"
                  >
                    <div className="flex h-full flex-col">
                      <span className="inline-flex items-start justify-start">
                        <svg
                          id={`profil-section-icon-${item.id}`}
                          viewBox="0 0 24 24"
                          role="img"
                          aria-label={item.iconTitle}
                          className="h-[clamp(2.1rem,4vw,2.8rem)] w-[clamp(2.1rem,4vw,2.8rem)] stroke-black transition-colors duration-650 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:stroke-white"
                          fill="none"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {item.iconPaths.map((pathValue, index) => (
                            <path key={`${item.id}-reduced-${index}`} d={pathValue} />
                          ))}
                        </svg>
                      </span>

                      <div
                        id={`profil-section-content-${item.id}`}
                        className="mt-[clamp(0.6rem,1.2vw,0.9rem)] block max-h-none opacity-100 transition-[max-height,opacity,transform] duration-650 ease-[cubic-bezier(0.16,1,0.3,1)] md:max-h-0 md:translate-y-[0.2rem] md:opacity-0 md:group-hover:max-h-[40rem] md:group-hover:translate-y-0 md:group-hover:opacity-100"
                      >
                        <h3 className="font-sans text-[clamp(0.95rem,1.4vw,1.15rem)] font-semibold leading-[1.2] text-black transition-colors duration-650 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-[clamp(0.45rem,1vw,0.7rem)] font-sans text-[clamp(0.8rem,1.1vw,0.95rem)] leading-[1.35] text-black/75 transition-colors duration-650 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:text-white/90">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section
            id="profil-section-section"
            aria-labelledby="profil-section-heading"
            className="relative z-40 mt-0 rounded-t-[clamp(1.2rem,2.8vw,2.4rem)] bg-white px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(3rem,8vw,6rem)] pb-[clamp(3rem,8vw,6rem)]"
          >
            <div
              ref={characteristicsRangeRef}
              id="profil-section-scroll-range"
              className="relative h-fit"
            >
              <div
                id="profil-section-stage"
                className="flex flex-col"
              >
                <header
                  id="profil-section-header"
                  className="mx-auto flex w-full max-w-[74rem] flex-col items-center text-center"
                >
                  <h2
                    id="profil-section-heading"
                    className="font-sans text-[clamp(1.7rem,4.2vw,3.35rem)] font-semibold leading-[1.04] tracking-tight text-black"
                  >
                    Profil von Daum Architekten
                  </h2>
                  <p
                    id="profil-section-intro"
                    className="mx-auto mt-[clamp(0.8rem,2vw,1.4rem)] max-w-[62ch] font-sans text-[clamp(0.95rem,1.5vw,1.12rem)] leading-[1.45] text-black/80"
                  >
                Daum Architekten entwickelt Umbau-, Sanierungs- und Neubauprojekte mit einem klaren Fokus auf Bestand, Präzision und zeitlose Materialität.
                </p>
                </header>

                <div
                  id="profil-section-canvas"
                  className="relative mx-auto mt-[clamp(1.5rem,4vw,3rem)] grid h-auto w-full max-w-[74rem] auto-rows-[minmax(clamp(8.2rem,26vw,10.8rem),auto)] grid-cols-2 gap-[clamp(0.75rem,1.6vw,1.2rem)] overflow-visible md:auto-rows-[minmax(max-content,auto)] md:grid-cols-12 md:gap-[clamp(0.45rem,1vw,0.85rem)]"
                >
                  {STUDIO_PROFIL_PILLARS.map((item, index) => {
                    return (
                      <article
                        key={item.id}
                        ref={(node) => {
                          characteristicsCardRefs.current[index] = node;
                        }}
                        id={`profil-section-card-${item.id}`}
                        className={
                          "group relative overflow-hidden rounded-[clamp(0.9rem,2vw,1.4rem)] border border-black/10 bg-white p-[clamp(0.9rem,2vw,1.25rem)] shadow-[0_0.8rem_2.1rem_rgba(0,0,0,0.14)] transition-[transform,box-shadow,background-color,border-color] duration-650 ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:z-[70] md:hover:-translate-y-[0.2rem] md:hover:border-black/40 md:hover:bg-black md:hover:shadow-[0_1rem_2.3rem_rgba(0,0,0,0.2)] " +
                          (CHARACTERISTICS_GRID_AREA_CLASSES[index] ?? "col-span-1 row-auto md:col-[1/5] md:row-[1/4]") +
                          " " +
                          (CHARACTERISTICS_DESKTOP_CARD_SIZE_CLASSES[index] ?? "h-auto w-full")
                        }
                        style={{ zIndex: CHARACTERISTICS_DESKTOP_CARD_Z[index] ?? 40 }}
                      >
                        <div className="relative flex h-auto w-full flex-col">
                          <span className="inline-flex items-start justify-start">
                            <svg
                              id={`profil-section-icon-${item.id}`}
                              viewBox="0 0 24 24"
                              role="img"
                              aria-label={item.iconTitle}
                              className="h-[clamp(2.1rem,4vw,2.8rem)] w-[clamp(2.1rem,4vw,2.8rem)] stroke-black transition-colors duration-650 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:stroke-white"
                              fill="none"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {item.iconPaths.map((pathValue, iconIndex) => (
                                <path key={`${item.id}-full-${iconIndex}`} d={pathValue} />
                              ))}
                            </svg>
                          </span>

                          <div
                            id={`profil-section-content-${item.id}`}
                            className="mt-[clamp(0.6rem,1.2vw,0.9rem)] block"
                          >
                            <h3 className="font-sans text-[clamp(0.95rem,1.4vw,1.15rem)] font-semibold leading-[1.2] text-black transition-colors duration-650 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:text-white">
                              {item.title}
                            </h3>
                            <p className="mt-[clamp(0.45rem,1vw,0.7rem)] font-sans text-[clamp(0.8rem,1.1vw,0.95rem)] leading-[1.35] text-black/75 transition-colors duration-650 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:text-white/90">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* <StackedCardsShowcase reducedMotion={reducedMotion} /> */}
        <TeamSection />
        <ContactCtaSection />
      </main>
      <div
        id="site-footer-reveal-spacer"
        className="h-[var(--site-footer-reveal-height,0px)]"
        aria-hidden="true"
      />
      <SiteFooterReveal />
    </>
  );
}
