"use client";

import Image from "next/image";
import { Fraunces, Nunito } from "next/font/google";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ───────── Fonts: soft rounded serif + rounded sans ───────── */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  variable: "--font-display",
  display: "swap",
});
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* ───────── Tokens ─────────
   ink      #0D0A2B   violet   #6C47FF   magenta  #E11D74
   tangerine #FF8A3D  mist     #F4F1FF   muted    #5A5675          */
const display =
  "font-[family-name:var(--font-display)] [font-variation-settings:'SOFT'_100]";
const sunset = "from-[#FF8A3D] via-[#FF3D81] to-[#6C47FF]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8A3D]";
const focusDark =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C47FF]";

/* ───────── Data ───────── */
type ProjectCategory = "plots" | "apartments";
type Project = {
  name: string;
  category: ProjectCategory;
  location: string;
  status: string;
  detail: string;
  draw: string;
  image: string;
};

const homes: Project[] = [
  {
    name: "GMADA Aerocity",
    category: "plots",
    location: "Airport Road / PR-7",
    status: "Ready for possession",
    detail: "Residential plots",
    draw: "The high-profile plotted address in Mohali, close to IT City with strong connectivity and investor liquidity.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Omaxe New Chandigarh",
    category: "plots",
    location: "Mullanpur",
    status: "Ready to move · New launches",
    detail: "Residential plots",
    draw: "An integrated township with green belts, proximity to Medicity and multiple plot size options.",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Wave Estate",
    category: "plots",
    location: "Sector 85, Mohali",
    status: "Ready to move · Under development",
    detail: "Residential plots",
    draw: "A centrally located, gated private township for families wanting a ready-to-build address.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "DLF Hyde Park Estate",
    category: "plots",
    location: "New Chandigarh",
    status: "Ready to move",
    detail: "Premium residential plots",
    draw: "Premium infrastructure, club amenities and wide internal boulevards for custom villa living.",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "GMADA Eco City 1 & 2",
    category: "plots",
    location: "New Chandigarh",
    status: "Ready for possession",
    detail: "Government-backed plots",
    draw: "Organized, greener surroundings near the PGIMER satellite hospital and sports complexes.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Marbella Grand",
    category: "apartments",
    location: "Sector 82A, IT City",
    status: "Under construction · Nearing possession",
    detail: "3, 4 & 5 BHK apartments",
    draw: "A benchmark for high-rise luxury with expansive layouts, skywalks and a large clubhouse.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Noble Callista",
    category: "apartments",
    location: "Sector 66B, Airport Road",
    status: "Under construction",
    detail: "3, 4 & 5 BHK apartments",
    draw: "A PR-7 address with large layouts, multi-tier security, smart-home features and grand finishes.",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "The Medallion & Nova",
    category: "apartments",
    location: "Sector 82 & Sector 66",
    status: "Under construction · New launch",
    detail: "3 & 4 BHK apartments",
    draw: "Mivan construction, prime IT City access and strong early-investor potential.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "JLPL Falcon View",
    category: "apartments",
    location: "Sector 66A, Mohali",
    status: "Partially ready · Under construction",
    detail: "3, 4 & 5 BHK apartments",
    draw: "An established luxury society with expansive carpet areas and a fully operational clubhouse.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Hero Homes",
    category: "apartments",
    location: "Sector 88, Mohali",
    status: "Partially ready · Under construction",
    detail: "3 & 4 BHK apartments",
    draw: "A rapidly developing residential hub near the District Administrative Complex.",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
  },
];

const team = [
  {
    name: "Mia Diaz",
    role: "Property Advisor",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Tina Korsgaard",
    role: "Sales Marketing",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85",
  },
  {
    name: "Tiana Dorin",
    role: "Property Agent",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=85",
  },
];

const links = [
  { label: "Home", id: "home" },
  { label: "About Us", id: "about" },
  { label: "Team", id: "team" },
  { label: "Our Properties", id: "properties" },
  { label: "Contact", id: "contact" },
];

/* ───────── Motion variants ───────── */
const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ───────── Small components ───────── */
function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-none stroke-current stroke-[1.8] transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

const tones = {
  light: {
    wrap: "bg-white text-[#0D0A2B] shadow-[0_12px_32px_-12px_rgba(13,10,43,.45)]",
    dot: "bg-[#0D0A2B] text-white",
  },
  dark: { wrap: "bg-[#0D0A2B] text-white", dot: "bg-white/15" },
  grad: {
    wrap: "bg-gradient-to-r from-[#E11D74] to-[#6C47FF] text-white shadow-[0_16px_40px_-12px_rgba(225,29,116,.7)]",
    dot: "bg-white/25",
  },
} as const;

function PillLink({
  href,
  children,
  tone = "light",
}: {
  href: string;
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  const t = tones[tone];
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none ${focus} ${t.wrap}`}
    >
      {children}
      <span className={`grid h-9 w-9 place-items-center rounded-full ${t.dot}`}>
        <Arrow />
      </span>
    </a>
  );
}

function Counter({
  to,
  decimals = 0,
  suffix = "",
}: {
  to: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    if (reduce) {
      node.textContent = to.toFixed(decimals) + suffix;
      return;
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (node.textContent = v.toFixed(decimals) + suffix),
    });
    return () => controls.stop();
  }, [inView, reduce, to, decimals, suffix]);
  return <span ref={ref}>{(0).toFixed(decimals) + suffix}</span>;
}

/* ───────── Page ───────── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHome, setActiveHome] = useState(0);
  const [projectCategory, setProjectCategory] =
    useState<ProjectCategory>("plots");
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const closeMenu = () => setMenuOpen(false);
  const visibleProjects = homes.filter(
    (home) => home.category === projectCategory,
  );

  // Page scroll progress bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  // Hero parallax
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(heroProgress, [0, 1], ["0%", "14%"]);
  const titleY = useTransform(heroProgress, [0, 1], ["0%", "-18%"]);

  // Close menu on Escape / outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [menuOpen]);

  // Scroll-spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && setActiveSection(e.target.id),
        ),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Carousel
  const onTrackScroll = () => {
    const el = trackRef.current;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return;
    const step = first.offsetWidth + 12;
    setActiveHome(
      Math.min(
        visibleProjects.length - 1,
        Math.max(0, Math.round(el.scrollLeft / step)),
      ),
    );
  };
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const n = (i + visibleProjects.length) % visibleProjects.length;
    el.scrollTo({
      left: (el.children[n] as HTMLElement).offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <main
        className={`${fraunces.variable} ${nunito.variable} overflow-x-hidden bg-[#0D0A2B] font-[family-name:var(--font-body)] text-[#0D0A2B] antialiased`}
      >
        {/* Scroll progress */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className={`fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r ${sunset}`}
        />

        {/* ─── HERO ─── */}
        <section
          ref={heroRef}
          id="home"
          className="relative flex min-h-screen flex-col overflow-hidden text-white"
        >
          <motion.div
            style={{ y: imgY }}
            className="absolute inset-x-0 -top-[10%] h-[125%]"
          >
            <Image
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2200&q=85"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#0D0A2B]/70 via-[#2B1A7A]/25 to-[#0D0A2B]/95"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_100%,rgba(255,61,129,.40),transparent)]"
            aria-hidden="true"
          />

          {/* Floating glass nav */}
          <nav
            ref={navRef}
            aria-label="Main navigation"
            className="relative z-20 mx-3 mt-3 flex h-14 items-center gap-2 rounded-full border border-white/20 bg-white/10 pl-4 pr-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)] backdrop-blur-xl sm:mx-4 sm:mt-4 sm:h-16 sm:gap-4 sm:pl-6 md:mx-8"
          >
            <a
              className={`flex min-w-0 items-center gap-2 whitespace-nowrap text-base font-semibold sm:text-lg ${display} ${focus}`}
              href="#home"
              aria-label="Placeholder brand, back to top"
            >
              <span
                aria-hidden="true"
                className={`h-3 w-3 rounded-full bg-gradient-to-br ${sunset}`}
              />
              Your Brand
            </a>

            <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
              {links.map(({ label, id }) => {
                const active = activeSection === id;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={active ? "true" : undefined}
                      className={`relative block rounded-full px-4 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none ${focus} ${
                        active
                          ? "text-[#0D0A2B]"
                          : "text-white hover:bg-white/15"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                          className="absolute inset-0 rounded-full bg-white"
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="ml-auto flex items-center gap-2">
              <a
                href="#contact"
                aria-label="Placeholder social profile"
                className={`hidden h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 transition-colors hover:bg-white/25 lg:grid ${focus}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-none stroke-current stroke-2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" className="fill-current" />
                </svg>
              </a>
              <a
                href="#contact"
                aria-label="Placeholder professional profile"
                className={`hidden h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 text-sm font-extrabold transition-colors hover:bg-white/25 lg:grid ${focus}`}
              >
                ••
              </a>
              <a
                href="#contact"
                className={`hidden items-center gap-2 rounded-full bg-gradient-to-r from-[#E11D74] to-[#6C47FF] px-5 py-2.5 text-sm font-bold text-white sm:flex ${focus}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-none stroke-current stroke-2"
                >
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                </svg>
                Contact us
              </a>
              <button
                type="button"
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 bg-white/10 text-xl leading-none md:hidden ${focus}`}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="primary-menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span aria-hidden="true">{menuOpen ? "×" : "≡"}</span>
              </button>
            </div>

            <AnimatePresence>
              {menuOpen && (
                <motion.ul
                  id="primary-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 flex flex-col gap-1 rounded-3xl border border-white/15 bg-[#0D0A2B]/95 p-2 shadow-2xl backdrop-blur-xl md:hidden"
                >
                  {links.map(({ label, id }) => {
                    const active = activeSection === id;
                    return (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          onClick={closeMenu}
                          aria-current={active ? "true" : undefined}
                          className={`block rounded-full px-5 py-3 text-center text-sm font-semibold transition-colors ${focus} ${
                            active
                              ? "bg-white text-[#0D0A2B]"
                              : "text-white hover:bg-white/15"
                          }`}
                        >
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </nav>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative z-10 flex flex-1 flex-col justify-between gap-8 px-4 pb-6 pt-8 sm:px-6 sm:pb-8 md:gap-10 md:px-10 md:pb-10 md:pt-10"
          >
            <motion.div
              variants={reveal}
              className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-6"
            >
              <p
                className={`max-w-[15rem] text-xl leading-tight sm:max-w-[18rem] sm:text-2xl md:text-3xl ${display}`}
              >
                Upgrade your life with smart home technology
              </p>
              <dl className="grid w-full grid-cols-2 gap-2 sm:gap-3 md:w-auto md:flex md:flex-col md:items-end">
                {[
                  {
                    to: 5.9,
                    decimals: 1,
                    label: "Deliveries",
                    copy: "successful deliveries of beautiful homes",
                  },
                  {
                    to: 10,
                    decimals: 0,
                    label: "Projects",
                    copy: "award-winning creative property projects",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="min-w-0 rounded-2xl border border-white/20 bg-white/10 px-3 py-3 backdrop-blur-md sm:rounded-3xl sm:px-5 sm:py-4 md:text-right"
                  >
                    <dt className="sr-only">{s.label}</dt>
                    <dd className={`text-3xl sm:text-4xl ${display}`}>
                      <Counter to={s.to} decimals={s.decimals} suffix="K+" />
                    </dd>
                    <dd className="mt-1 text-[10px] leading-snug text-white/85 sm:text-xs md:ml-auto md:max-w-[9.5rem]">
                      {s.copy}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            <motion.div variants={reveal}>
              <motion.h1
                style={{ y: titleY }}
                className={`bg-gradient-to-r from-white via-[#FFD6E6] to-[#FFB487] bg-clip-text pb-[.1em] text-center text-[clamp(42px,15vw,220px)] font-semibold leading-[.95] tracking-[-.05em] text-transparent ${display}`}
              >
                Your Brand
              </motion.h1>
            </motion.div>

            <motion.div
              variants={reveal}
              className="flex flex-col items-center gap-5 md:flex-row md:items-end md:justify-between"
            >
              <p className="hidden max-w-[12rem] text-sm leading-snug text-white/85 md:block">
                Where modern living meets timeless design.
              </p>
              <PillLink href="#properties" tone="grad">
                Discover more
              </PillLink>
              <p className="hidden max-w-[12rem] text-right text-sm leading-snug text-white/85 md:block">
                Thoughtfully designed for how you live.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* ─── ABOUT ─── */}
        <motion.section
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="rounded-t-[32px] bg-[#F4F1FF] px-4 py-14 sm:px-6 sm:py-20 md:rounded-t-[48px] md:px-[clamp(40px,8vw,150px)] md:py-28"
        >
          <motion.h2
            variants={reveal}
            className={`mb-10 text-center text-3xl font-semibold leading-[1.08] tracking-[-.03em] sm:text-4xl md:mb-20 md:text-6xl ${display}`}
          >
            Experience Excellence
            <br />
            In Real Estate
          </motion.h2>

          <div className="grid items-center gap-9 sm:gap-12 md:grid-cols-[1fr_1.05fr_1fr] md:gap-12">
            <motion.div variants={reveal}>
              <h3
                className={`mb-3 max-w-xs text-xl font-medium leading-snug sm:text-2xl ${display}`}
              >
                Your Trusted Partner in Finding the Perfect Home
              </h3>
              <p className="mb-7 max-w-sm text-sm leading-relaxed text-[#5A5675] sm:text-base">
                At Your Brand, we believe that buying or selling a home should
                be an exciting and stress-free experience.
              </p>
              <PillLink href="#team" tone="dark">
                About us
              </PillLink>
              <div className="mt-10 text-sm text-[#5A5675]">
                <span className="mb-3 block font-semibold">Our partners</span>
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-bold text-[#0D0A2B]">
                  {["Partner One", "Partner Two", "Partner Three"].map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${sunset}`}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              variants={reveal}
              className="relative h-[300px] overflow-hidden rounded-[28px] bg-[#E3DDFB] shadow-[0_40px_80px_-40px_rgba(108,71,255,.6)] sm:h-[340px] sm:rounded-[40px] md:h-[460px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85"
                alt="Modern home with a pool at dusk"
                fill
                sizes="(min-width: 768px) 34vw, 100vw"
                className="object-cover transition-transform duration-700 motion-reduce:transition-none hover:scale-105"
              />
            </motion.div>

            <motion.div
              variants={reveal}
              className="flex flex-col justify-center"
            >
              <div className="border-b border-[#D8D1F5] pb-5">
                <h3
                  className={`mb-1 text-lg font-medium sm:text-xl ${display}`}
                >
                  Expert Guidance
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-[#5A5675]">
                  Our experienced agents provide professional advice and
                  personalized support.
                </p>
              </div>
              <div className="border-b border-[#D8D1F5] py-5">
                <h3
                  className={`mb-1 text-lg font-medium sm:text-xl ${display}`}
                >
                  Wide Property Selection
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-[#5A5675]">
                  From luxury homes to budget-friendly apartments, we have
                  something for everyone.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex" aria-hidden="true">
                  {["JD", "AS", "RK"].map((i) => (
                    <span
                      key={i}
                      className={`-mr-2 grid h-10 w-10 place-items-center rounded-full border-2 border-[#F4F1FF] bg-gradient-to-br text-xs font-bold text-white ${sunset}`}
                    >
                      {i}
                    </span>
                  ))}
                </div>
                <div className="pl-3">
                  <b className={`block text-2xl ${display}`}>4.9</b>
                  <span className="block text-xs font-semibold text-[#5A5675]">
                    Customer ratings
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ─── TEAM ─── */}
        <motion.section
          id="team"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="relative overflow-hidden bg-[#0D0A2B] text-white"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_85%_15%,rgba(108,71,255,.45),transparent)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto flex max-w-[1170px] flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20 md:flex-row md:items-center md:gap-14 md:px-10 md:py-28">
            <motion.ul
              variants={reveal}
              className="grid flex-1 grid-cols-3 gap-2 sm:gap-3 md:gap-4"
            >
              {team.map((p) => (
                <li key={p.name} className="group">
                  <div className="rounded-[30px] bg-transparent p-1 transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-[#FF8A3D] group-hover:via-[#FF3D81] group-hover:to-[#6C47FF]">
                    <div className="relative h-36 overflow-hidden rounded-[20px] bg-[#1b1647] sm:h-44 sm:rounded-[26px] md:h-64">
                      <Image
                        src={p.image}
                        alt={`Portrait of ${p.name}`}
                        fill
                        sizes="(min-width: 768px) 14vw, 30vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <p className="mt-2 truncate px-1 text-xs font-bold sm:mt-3 sm:text-sm">
                    {p.name}
                  </p>
                  <p className="truncate px-1 text-[10px] text-[#B9B3E0] sm:text-xs">
                    {p.role}
                  </p>
                </li>
              ))}
            </motion.ul>
            <motion.div variants={reveal} className="max-w-sm">
              <h2
                className={`text-3xl font-semibold leading-[1.08] tracking-[-.03em] sm:text-4xl md:text-5xl ${display}`}
              >
                Meet Our Expert Team
              </h2>
              <p className="mb-7 mt-4 text-base leading-relaxed text-[#C9C4EC]">
                Our team of experienced professionals is committed to helping
                you find the perfect home or investment property.
              </p>
              <PillLink href="#contact" tone="grad">
                Contact the team
              </PillLink>
            </motion.div>
          </div>
        </motion.section>

        {/* ─── PROPERTIES ─── */}
        <motion.section
          id="properties"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="rounded-t-[32px] bg-[#F4F1FF] px-4 py-14 sm:px-6 sm:py-20 md:rounded-t-[48px] md:px-[clamp(40px,8vw,150px)] md:py-28"
        >
          <motion.div
            variants={reveal}
            className="mb-12 md:mb-16 md:flex md:items-end md:justify-between"
          >
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[.18em] text-[#6C47FF]">
                Mohali property guide
              </p>
              <h2
                className={`text-3xl font-semibold leading-[1.08] tracking-[-.03em] sm:text-4xl md:text-6xl ${display}`}
              >
                Top residential
                <br />
                projects
              </h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {(
                  [
                    ["plots", "Residential Plots"],
                    ["apartments", "Apartments"],
                  ] as const
                ).map(([category, label]) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setProjectCategory(category);
                      setActiveHome(0);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${projectCategory === category ? "bg-[#0D0A2B] text-white" : "bg-white text-[#5A5675] ring-1 ring-[#6C47FF]/20 hover:ring-[#6C47FF]/50"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-5 max-w-xs text-base leading-relaxed text-[#5A5675] md:mt-0">
              Explore leading residential projects across Mohali, Airport Road
              and New Chandigarh, with location and development status at a
              glance.
            </p>
          </motion.div>

          <div
            ref={trackRef}
            onScroll={onTrackScroll}
            role="region"
            aria-label="Featured properties"
            className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto pb-10 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-5 md:overflow-visible"
          >
            {visibleProjects.map((home) => (
              <motion.a
                key={home.name}
                variants={reveal}
                whileHover={{ y: -10, transition: { duration: 0.25 } }}
                href="#contact"
                aria-label={`${home.name}, ${home.location}, ${home.status}. Enquire`}
                className={`group block min-w-[88%] shrink-0 snap-start rounded-[26px] bg-white p-2.5 shadow-[0_30px_60px_-30px_rgba(108,71,255,.5)] ring-1 ring-[#6C47FF]/10 sm:min-w-[82%] sm:rounded-[34px] sm:p-3 md:min-w-0 ${focusDark}`}
              >
                <div className="relative h-[260px] overflow-hidden rounded-[20px] bg-[#E3DDFB] sm:h-[300px] sm:rounded-[26px] md:h-[340px]">
                  <Image
                    src={home.image}
                    alt={`${home.name} in ${home.location}`}
                    fill
                    sizes="(min-width: 768px) 30vw, 82vw"
                    className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-[#0D0A2B]/65 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    {home.location}
                  </span>
                </div>
                <div className="px-3 pb-4 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={`text-lg font-medium leading-tight sm:text-xl ${display}`}
                    >
                      {home.name}
                    </h3>
                    <span className="whitespace-nowrap rounded-full bg-[#F4F1FF] px-3 py-1.5 text-xs font-extrabold text-[#4B2BD6]">
                      {home.detail}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#4B2BD6]">
                    {home.status}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#5A5675]">
                    {home.draw}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 text-sm font-bold text-[#5A5675] md:hidden">
            <button
              type="button"
              className={`h-12 w-12 rounded-full border border-[#6C47FF]/40 bg-white transition hover:bg-[#6C47FF] hover:text-white ${focusDark}`}
              aria-label="Previous property"
              onClick={() => goTo(activeHome - 1)}
            >
              ←
            </button>
            <span aria-live="polite">
              {activeHome + 1} / {visibleProjects.length}
            </span>
            <button
              type="button"
              className={`h-12 w-12 rounded-full border border-[#6C47FF]/40 bg-white transition hover:bg-[#6C47FF] hover:text-white ${focusDark}`}
              aria-label="Next property"
              onClick={() => goTo(activeHome + 1)}
            >
              →
            </button>
          </div>
        </motion.section>

        {/* ─── FOOTER ─── */}
        <motion.footer
          id="contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
          className="relative overflow-hidden rounded-t-[32px] bg-[#0D0A2B] px-4 py-14 text-white sm:px-6 sm:py-20 md:rounded-t-[48px] md:px-[max(40px,calc((100%-1170px)/2))] md:py-28"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_20%_0%,rgba(255,61,129,.30),transparent),radial-gradient(45%_60%_at_90%_100%,rgba(108,71,255,.45),transparent)]"
            aria-hidden="true"
          />
          <div className="relative border-b border-white/15 pb-14 md:flex md:items-end md:justify-between md:pb-20">
            <h2
              className={`text-4xl font-semibold leading-[1.05] tracking-[-.04em] sm:text-5xl md:text-[clamp(44px,6vw,88px)] ${display}`}
            >
              Let&apos;s find your
              <br />
              <span
                className={`bg-gradient-to-r bg-clip-text pb-[.1em] text-transparent ${sunset}`}
              >
                place together.
              </span>
            </h2>
            <div className="mt-9 md:mt-0">
              <PillLink href="#contact" tone="light">
                Get in touch
              </PillLink>
            </div>
          </div>
          <div className="relative flex flex-col gap-3 pt-7 text-sm text-[#B9B3E0] md:flex-row md:justify-between">
            <span>© {new Date().getFullYear()} Your Brand</span>
            <span>City One · City Two · City Three</span>
            <span className="flex gap-5">
              <a
                className={`underline-offset-4 hover:text-white hover:underline ${focus}`}
                href="#contact"
              >
                Social Link
              </a>
              <a
                className={`underline-offset-4 hover:text-white hover:underline ${focus}`}
                href="#contact"
              >
                Professional Link
              </a>
            </span>
          </div>
          <p className="relative mt-6 text-xs text-[#8E87C2]">
            Designed &amp; built with Next.js, Tailwind CSS and Framer Motion.
          </p>
        </motion.footer>
      </main>
    </MotionConfig>
  );
}
