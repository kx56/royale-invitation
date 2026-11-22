"use client";
/* eslint-disable @next/next/no-img-element -- the source stylesheet sizes and layers these images itself */

import { useEffect, useMemo, useSyncExternalStore, type CSSProperties } from "react";

const noopSubscribe = () => () => {};
import {
  initCeremonyCards,
  initDateReveal,
  initGallery,
  initGate,
  initHeroVideo,
  initOutro,
  initScrollCue,
  initScrolls,
  initSmoothScroll,
} from "./behaviors";
import {
  A,
  CEREMONIES,
  COMPLIMENTS,
  FAMILIES,
  FRAMES,
  NOTE,
  ceremonyDate,
  defaultWeddingDate,
  fmtDate,
  fmtTime,
  mapLink,
  type GalleryFrame,
  type Ymd,
} from "./data";
import { CEREMONY_PANEL } from "./paths";
import { PlaqueFrame } from "./plaque";
import { ScrollCard } from "./scroll-card";
import { Social } from "./social";

const Tear = ({ pos, lazy = true }: { pos: "top" | "bottom"; lazy?: boolean }) => (
  <img
    className={`ry-tear ry-tear--${pos}`}
    src={`${A}/section_divider.svg`}
    alt=""
    aria-hidden="true"
    loading={lazy ? "lazy" : undefined}
    decoding={lazy ? "async" : undefined}
  />
);

function Frame({ f }: { f: GalleryFrame }) {
  return (
    <div className={`gframe gframe--${f.kind}`} style={{ "--hang": `${f.hang}px` } as CSSProperties}>
      <span className="gframe__hook" aria-hidden="true" />
      <svg className="gframe__cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M50 0L0 100M50 0L100 100" />
        <path className="gframe__twist" d="M50 0L0 100M50 0L100 100" />
      </svg>
      <div className="gframe__body">
        <span className="gframe__side gframe__side--top" />
        <span className="gframe__side gframe__side--right" />
        <span className="gframe__side gframe__side--bottom" />
        <span className="gframe__side gframe__side--left" />
        <div className="gframe__face">
          <div className="gframe__lip">
            {f.kind === "story" ? (
              <div className="gframe__mat gframe__story">
                <p>{f.story}</p>
              </div>
            ) : (
              <figure className="gframe__mat">
                <div className="gframe__photo">
                  <span className="gframe__placeholder">Your photo here</span>
                </div>
                <figcaption className="gframe__caption">{f.caption}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoyaleInvitation() {
  // Resolved after mount: the default wedding date is "15 days from today".
  // A string snapshot keeps useSyncExternalStore stable; null on the server.
  const key = useSyncExternalStore(
    noopSubscribe,
    () => {
      const d = defaultWeddingDate();
      return `${d.year}-${d.month}-${d.day}`;
    },
    () => null,
  );
  const wedding = useMemo<Ymd | null>(() => {
    if (!key) return null;
    const [year, month, day] = key.split("-").map(Number);
    return { year, month, day };
  }, [key]);

  useEffect(() => {
    const cleanups = [initGate(), initHeroVideo(), initScrollCue(), initGallery()];
    return () => cleanups.forEach((c) => c());
  }, []);

  // These need the dates (and the cards they arm) in the DOM first.
  useEffect(() => {
    if (!wedding) return;
    const cleanups = [
      initDateReveal(wedding),
      initScrolls(),
      initCeremonyCards(),
      initOutro(),
      initSmoothScroll(),
    ];
    return () => cleanups.forEach((c) => c());
  }, [wedding]);

  return (
    <>
      {/* The gate: a fixed cover over the hero until it is tapped. */}
      <div className="royale-gate" id="ryGate" role="button" tabIndex={0} aria-label="Open the invitation">
        <div className="royale-gate__flap royale-gate__flap--start" aria-hidden="true">
          <span className="royale-gate__flap-pattern" />
        </div>
        <div className="royale-gate__flap royale-gate__flap--end" aria-hidden="true">
          <span className="royale-gate__flap-pattern" />
        </div>
        <div className="royale-gate__door royale-gate__door--start" aria-hidden="true" />
        <div className="royale-gate__door royale-gate__door--end" aria-hidden="true" />

        {(["sprig-left", "sprig-right"] as const).map((s) => (
          <div key={s} className={`royale-gate__decor royale-gate__decor--${s}`} aria-hidden="true">
            <img className="royale-gate__floral" src={`${A}/floral1.png`} alt="" draggable={false} />
          </div>
        ))}
        {(["elephant-left", "elephant-right"] as const).map((s) => (
          <div key={s} className={`royale-gate__decor royale-gate__decor--${s}`} aria-hidden="true">
            <img className="royale-gate__elephant" src={`${A}/elephant.png`} alt="" draggable={false} />
          </div>
        ))}

        <div className="royale-card">
          <span className="royale-card__motif" aria-hidden="true" />
          <span className="royale-card__symbol" aria-hidden="true" />
          <p className="royale-card__mantra" id="ryInvocation" lang="sa">श्री गणेशाय नमः</p>
          <p className="royale-card__note" id="ryIntroNote">
            we cordially invite you to grace the auspicious occasion of the marriage of&hellip;
          </p>
          <span className="royale-card__cue ry-plaque" aria-hidden="true">
            <PlaqueFrame idPrefix="ryCue" />
            <span className="ry-plaque__label">Tap to open</span>
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="royale-hero" aria-label="The couple">
        <div className="royale-hero__frame">
          <video
            className="royale-hero__image royale-hero__video"
            id="ryHeroVideo"
            muted
            loop
            playsInline
            preload="auto"
            data-src={`${A}/garden_palace.mp4`}
            data-poster={`${A}/garden_palace_poster.webp`}
            data-from="(max-width: 699px)"
            disablePictureInPicture
            aria-hidden="true"
            tabIndex={-1}
          />
          <picture className="royale-hero__still">
            <source media="(max-width: 699px)" srcSet={`${A}/garden_palace_poster.webp`} />
            <img className="royale-hero__image" src={`${A}/mandap_dusk.webp`} width={2322} height={1224} alt="" aria-hidden="true" draggable={false} />
          </picture>
          <h1 className="royale-couple" id="ryCouple" tabIndex={-1}>
            <span className="royale-couple__name" id="ryBrideName">Ankita</span>
            <span className="royale-couple__amp">&amp;</span>
            <span className="royale-couple__name" id="ryGroomName">Kaushik</span>
          </h1>
        </div>
        <Tear pos="bottom" lazy={false} />
        <div className="scroll-cue" aria-hidden="true" data-after-cover data-delay="0">
          <span className="scroll-cue__text">Scroll down</span>
          <svg className="scroll-cue__arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 9l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* The families */}
      <section className="royale-scrolls royale-families" aria-label="The families">
        {FAMILIES.map((f) => (
          <ScrollCard key={f.id} id={f.id} card={f.card}>
            <h2 className="royale-scroll__name">{f.name}</h2>
            <p className="royale-scroll__block">
              <span className="royale-scroll__rel">{f.relLabel}</span>
              <span className="royale-scroll__elder">{f.parents[0]}</span>
              <span className="royale-scroll__amp">&amp;</span>
              <span className="royale-scroll__elder">{f.parents[1]}</span>
            </p>
          </ScrollCard>
        ))}
      </section>

      {/* The date reveal */}
      <section className="royale-date" id="ryDateReveal" aria-label="The date">
        <div className="royale-date__stage">
          <img className="royale-date__crown" src={`${A}/lotus_bunch.png`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div className="royale-date__plaques" role="group" aria-label="Wedding date">
            {(
              [
                ["day", "Date"],
                ["month", "Month"],
                ["year", "Year"],
              ] as const
            ).map(([dial, cap]) => (
              <div key={dial} className="royale-date__plaque" data-dial={dial}>
                <span className="royale-date__cap">{cap}</span>
                <div className="royale-date__window">
                  <div className="royale-date__strip" data-strip suppressHydrationWarning />
                </div>
              </div>
            ))}
          </div>
          <img className="royale-date__elephant royale-date__elephant--left" src={`${A}/elephant.png`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <img className="royale-date__elephant royale-date__elephant--right" src={`${A}/elephant.png`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div className="royale-date__action">
            <p className="royale-date__after" id="ryRevealAfter" hidden>Save the Date</p>
          </div>
          <p className="royale-date__said" id="ryRevealSaid" aria-live="polite" />
        </div>
      </section>

      {/* Pavilion */}
      <div className="royale-pavilion" aria-hidden="true">
        <img className="royale-pavilion__image" src={`${A}/pavilion.webp`} alt="" width={1500} height={927} loading="lazy" decoding="async" draggable={false} />
      </div>

      {/* Gallery */}
      <section className="royale-gallery" aria-label="Our story in pictures">
        <img className="royale-gallery__divider" src={`${A}/divider3.png`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <div className="royale-gallery__scroll" id="ryGalleryScroll">
          <div className="royale-gallery__track">
            <div className="royale-gallery__rail" aria-hidden="true" />
            {FRAMES.map((f, i) => (
              <Frame key={i} f={f} />
            ))}
          </div>
        </div>
        <div className="ry-hint royale-gallery__hint" id="ryGalleryHint" aria-hidden="true">
          <span className="ry-hint__arrows"><i /><i /><i /></span>
          <span className="ry-hint__text">Swipe</span>
          <span className="ry-hint__arrows"><i /><i /><i /></span>
        </div>
      </section>

      {/* Ceremonies */}
      <svg className="ryc-defs" aria-hidden="true" focusable="false" width="0" height="0">
        <defs>
          <clipPath id="ryCeremonyPanel" clipPathUnits="objectBoundingBox">
            <path d={CEREMONY_PANEL} />
          </clipPath>
        </defs>
      </svg>
      <section className="royale-ceremonies" aria-label="Ceremonies">
        <h2 className="ryc-title">Ceremonies</h2>
        <div className="ryc-grid">
          {CEREMONIES.map((c, i) => {
            const when = wedding ? ceremonyDate(wedding, c.offset) : null;
            return (
              <FragmentCard key={c.name} index={i}>
                <article className="ryc-card" data-offset={c.offset} data-time={c.time}>
                  <div className="ryc-card__inner">
                    <div className="ryc-card__artwell">
                      <img className="ryc-card__art" src={`${A}/${c.art}`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                    </div>
                    <h3 className="ryc-card__name">{c.name}</h3>
                    <div className="ryc-card__foot">
                      <div className="ryc-card__where">
                        <p className="ryc-card__venue">{c.venue}</p>
                        <a className="ryc-card__map" href={mapLink(c.venue)} target="_blank" rel="noopener noreferrer" aria-label={`${c.name} venue on the map`}>
                          <img src={`${A}/location.svg`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                        </a>
                      </div>
                      <p className="ryc-card__when">
                        <span className="ryc-card__date">{when ? fmtDate(when) : ""}</span>
                        <span className="ryc-card__time">{fmtTime(c.time)}</span>
                      </p>
                    </div>
                  </div>
                </article>
              </FragmentCard>
            );
          })}
        </div>
        <Tear pos="bottom" />
      </section>

      {/* Compliments and the note */}
      <section className="royale-scrolls royale-closing" aria-label="Compliments and a note">
        <ScrollCard id="ryComplimentCard" card="compliments">
          <h2 className="royale-scroll__name">With Best Compliments From:</h2>
          <div className="royale-scroll__lines">
            {COMPLIMENTS.map((l) => (
              <p key={l} className="royale-scroll__line">{l}</p>
            ))}
          </div>
        </ScrollCard>
        <ScrollCard id="ryNoteCard" card="note">
          <h2 className="royale-scroll__name">A Note From Us</h2>
          <p className="royale-scroll__note">{NOTE}</p>
        </ScrollCard>
      </section>

      <Social wedding={wedding} />

      {/* Closing picture */}
      <section className="royale-outro">
        <Tear pos="top" />
        <picture>
          <source media="(min-width: 700px)" srcSet={`${A}/garden_close.webp`} width={1672} height={941} />
          <img className="royale-outro__image" src={`${A}/garden_close_tall.webp`} alt="" width={941} height={1672} loading="lazy" decoding="async" draggable={false} />
        </picture>
        <div className="royale-outro__easel">
          <div className="royale-outro__board">
            <p className="royale-outro__line">Your Presence Means the World to Us</p>
          </div>
        </div>
        <Tear pos="bottom" />
      </section>
    </>
  );
}

/** A ceremony card followed by its divider, as the source's grid lays them out. */
function FragmentCard({ children, index }: { children: React.ReactNode; index: number }) {
  // The source puts a row-break divider after the third card (two-row desktop grid).
  const rowBreak = index === 2;
  return (
    <>
      {children}
      <img
        className={`ryc-divider${rowBreak ? " ryc-divider--row" : ""}`}
        src={`${A}/divider2.png`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
    </>
  );
}
