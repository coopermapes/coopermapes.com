# Contact Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the contact page into two screens — a card-based landing screen and an Anantara-style wizard screen — with a smooth animated transition between them.

**Architecture:** A single `contactView` state (`"landing" | "wizard"`) inside `ContactSection.tsx` controls which screen renders. Screen 1 is a centered card-selector (Untitled UI reference). Screen 2 wraps the existing wizard in a dark full-width layout with a placeholder background image, large header top-left, socials bottom-left, and the wizard card floating right. All existing wizard logic (state, validation, paths, submission) is untouched — only the shell around it changes. Transition is a CSS opacity + translateY fade orchestrated with a short timeout.

**Tech Stack:** React, Next.js (App Router), inline styles, existing Anton + Inter font vars, existing GridPattern component

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/components/ContactSection.tsx` | Modify | Add view state, Screen 1 landing, Screen 2 Anantara shell, transition animation |
| `app/contact/page.tsx` | No change | Already minimal wrapper |

---

### Task 1: Add view state and transition scaffolding

**Files:**
- Modify: `app/components/ContactSection.tsx`

- [ ] **Step 1: Add `contactView` and `transitioning` state at the top of `ContactSection`**

Add these two lines directly below the existing `const [wizardError, setWizardError] = useState("");` line:

```tsx
const [contactView,   setContactView]   = useState<"landing" | "wizard">("landing");
const [transitioning, setTransitioning] = useState(false);
```

- [ ] **Step 2: Add the `goToWizard` transition function**

Add this function directly after the `resetWizard` function (around line 217):

```tsx
function goToWizard() {
  setTransitioning(true);
  setTimeout(() => {
    setContactView("wizard");
    setTransitioning(false);
  }, 320);
}
```

- [ ] **Step 3: Verify the file compiles**

Visit `http://localhost:3000/contact` — page should look identical to before (no visual change yet).

---

### Task 2: Build Screen 1 — Landing card selector

**Files:**
- Modify: `app/components/ContactSection.tsx`

- [ ] **Step 1: Replace the entire `return (...)` block's outer section with a conditional render**

Find the current return statement opening:
```tsx
return (
  <section style={{ background: "#EAEAEA", minHeight: "calc(100vh - 98px)" }}>
```

Replace it with:
```tsx
return (
  <section style={{ background: "#EAEAEA", minHeight: "calc(100vh - 98px)", position: "relative", overflow: "hidden" }}>
```

Then, immediately after the opening `<section ...>` tag and before the existing `<div style={{ maxWidth: 1100 ...` wrapper, insert the Screen 1 block:

```tsx
{/* ── Screen 1: Landing ── */}
{contactView === "landing" && (
  <div style={{
    position: "relative",
    minHeight: "calc(100vh - 98px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(48px,6vw,96px) clamp(24px,5vw,64px)",
    opacity: transitioning ? 0 : 1,
    transform: transitioning ? "translateY(10px)" : "translateY(0)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  }}>
    {/* Grid pattern background */}
    <GridPattern />

    {/* Header */}
    <div style={{ textAlign: "center", marginBottom: "clamp(40px,5vw,64px)", position: "relative", zIndex: 1 }}>
      <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#1254D9", marginBottom: 16 }}>
        Cooper Mapes
      </p>
      <h1 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(42px,6vw,80px)", textTransform: "uppercase", letterSpacing: "-1.5px", lineHeight: 0.92, color: "#111111", margin: 0 }}>
        Get In Touch
      </h1>
      <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#5A5A5A", maxWidth: 480, margin: "20px auto 0", lineHeight: 1.55 }}>
        Tell me what your show needs — I&apos;ll get back to you within 1–2 business days.
      </p>
    </div>

    {/* Cards */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 20,
      width: "100%",
      maxWidth: 900,
      position: "relative",
      zIndex: 1,
    }}>
      {/* Card 1 — Get a Quote (active) */}
      <ContactCard
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1254D9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        }
        title="Get a Quote"
        description="Submit your show details and I'll put together a quote for flip folder conversion or revoicing."
        cta="Start Here"
        onClick={goToWizard}
        active
      />

      {/* Card 2 — Send an Inquiry (placeholder) */}
      <ContactCard
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9A9A95" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        }
        title="Send an Inquiry"
        description="Have a question before committing? Send a general message and I'll get back to you."
        cta="Coming Soon"
        onClick={() => {}}
        locked
      />

      {/* Card 3 — Coming Soon */}
      <ContactCard
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9A9A95" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        }
        title="Coming Soon"
        description="More contact options on the way."
        cta="Coming Soon"
        onClick={() => {}}
        locked
      />

      {/* Card 4 — Coming Soon */}
      <ContactCard
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9A9A95" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        }
        title="Coming Soon"
        description="More contact options on the way."
        cta="Coming Soon"
        onClick={() => {}}
        locked
      />
    </div>

    {/* Email fallback */}
    <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "#9A9A95", marginTop: 40, position: "relative", zIndex: 1 }}>
      Prefer email?{" "}
      <a href="mailto:contact@coopermapes.com" style={{ color: "#1254D9", textDecoration: "none", fontWeight: 500 }}>
        contact@coopermapes.com
      </a>
    </p>
  </div>
)}
```

- [ ] **Step 2: Add the `ContactCard` sub-component above the `ContactSection` export**

Add this before the `export default function ContactSection()` line:

```tsx
function ContactCard({
  icon, title, description, cta, onClick, active, locked,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  active?: boolean;
  locked?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={locked ? undefined : onClick}
      onMouseEnter={() => !locked && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${hov && !locked ? "#1254D9" : "#DCDBD7"}`,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        cursor: locked ? "default" : "pointer",
        opacity: locked ? 0.45 : 1,
        transition: "border-color .18s ease, box-shadow .18s ease, opacity .18s ease",
        boxShadow: hov && !locked ? "0 4px 24px rgba(18,84,217,0.10)" : "none",
      }}
    >
      <div style={{
        width: 48, height: 48, background: active ? "#EEF3FD" : "#F7F6F4",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: 22, textTransform: "uppercase", letterSpacing: "-.5px", color: "#111111", marginBottom: 8 }}>
          {title}
        </div>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "#5A5A5A", lineHeight: 1.6, margin: 0 }}>
          {description}
        </p>
      </div>
      <div style={{
        fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 600,
        letterSpacing: "1px", textTransform: "uppercase",
        color: locked ? "#9A9A95" : "#1254D9",
        marginTop: "auto",
      }}>
        {cta} {!locked && "→"}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify Screen 1 in browser**

Visit `http://localhost:3000/contact`. You should see:
- Centered layout with grid pattern background
- "GET IN TOUCH" Anton header
- 4 cards below: "Get a Quote" (active/blue), "Send an Inquiry" (dimmed), 2× "Coming Soon" (dimmed)
- Clicking "Get a Quote" does nothing yet (wizard screen not wired up)

---

### Task 3: Build Screen 2 — Anantara-style wizard shell

**Files:**
- Modify: `app/components/ContactSection.tsx`

- [ ] **Step 1: Wrap the existing wizard markup in Screen 2's shell**

Find the existing `{/* Wizard card or success */}` comment block (currently the main content area) and the `{/* Header */}` block above it. 

Replace everything from `{/* Header */}` down to the closing `</section>` tag (the very end of the return) with the following. The `WIZARD_CONTENT` placeholder below represents the existing `.wiz-shell` div and success card — do not change those, just move them into the right column:

```tsx
{/* ── Screen 2: Wizard shell ── */}
{contactView === "wizard" && (
  <div style={{
    position: "relative",
    minHeight: "calc(100vh - 98px)",
    opacity: transitioning ? 0 : 1,
    transform: transitioning ? "translateY(10px)" : "translateY(0)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  }}>
    {/* Placeholder background — replace src with real image later */}
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(135deg, #0a0a09 0%, #181816 40%, #0f1018 100%)",
      zIndex: 0,
    }} />

    {/* Dark overlay for readability */}
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1 }} />

    {/* Content grid */}
    <div style={{
      position: "relative", zIndex: 2,
      display: "grid",
      gridTemplateColumns: "1fr minmax(460px, 520px)",
      gridTemplateRows: "1fr auto",
      minHeight: "calc(100vh - 98px)",
      padding: "clamp(48px,5vw,72px) clamp(24px,5vw,56px)",
      gap: "clamp(32px,4vw,56px)",
      maxWidth: 1320,
      margin: "0 auto",
      alignItems: "start",
    }}>

      {/* Left col — header + back link */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div>
          <button
            onClick={() => {
              setTransitioning(true);
              setTimeout(() => { setContactView("landing"); setTransitioning(false); resetWizard(); }, 320);
            }}
            style={{
              fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 600,
              letterSpacing: "1.2px", textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)", background: "none", border: "none",
              cursor: "pointer", padding: 0, marginBottom: 32,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            All Options
          </button>

          <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#5B7BD6", marginBottom: 16 }}>
            Contact
          </p>
          <h1 style={{
            fontFamily: "var(--font-anton)", fontWeight: 400,
            fontSize: "clamp(42px,5.5vw,80px)",
            textTransform: "uppercase", letterSpacing: "-2px", lineHeight: 0.9,
            color: "#FFFFFF", margin: 0,
          }}>
            Get<br />In<br />Touch
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 320, marginTop: 24, lineHeight: 1.6 }}>
            Tell me what your show needs — I&apos;ll get back to you within 1–2 business days.
          </p>
        </div>

        {/* Bottom-left socials */}
        <div style={{ marginTop: 48 }}>
          <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600, letterSpacing: "1.4px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>
            Reach Out
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="mailto:contact@coopermapes.com" style={{ fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
              contact@coopermapes.com
            </a>
            <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
              {[
                { label: "LinkedIn",  href: "https://www.linkedin.com/in/coopermapes/" },
                { label: "Instagram", href: "https://www.instagram.com/coopermapes" },
                { label: "YouTube",   href: "https://youtube.com/@coopermapes/videos" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, letterSpacing: ".4px", color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right col — wizard card */}
      <div style={{ alignSelf: "start" }}>
        {wizardDone ? SuccessCard : (
          <div className="wiz-shell" style={{ display: "flex", alignItems: "stretch", border: "1px solid #DCDBD7", minHeight: 580, background: "#FFFFFF" }}>

            {/* Sidebar */}
            <div className="wiz-sidebar" style={{ flex: "0 0 220px", background: "#F7F6F4", borderRight: "1px solid #DCDBD7", padding: "32px 24px" }}>
              <h2 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: 18, letterSpacing: "-.5px", textTransform: "uppercase", color: "#111111", margin: "0 0 28px" }}>
                Get a Quote
              </h2>
              {wizardPath && steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 24 }}>
                  <StepDot state={dotState(i)} />
                  <div>
                    <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, lineHeight: 1.3, color: i + 1 === wizardStep ? "#111111" : i + 1 < wizardStep ? "#1254D9" : "#9A9A95" }}>
                      {s.name}
                    </div>
                    <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, color: "#9A9A95", marginTop: 2, lineHeight: 1.4 }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile top bar */}
            <div className="wiz-mobile-bar" style={{ display: "none", padding: "14px 20px", background: "#F7F6F4", borderBottom: "1px solid #DCDBD7" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {wizardPath && steps.map((s, i) => <StepDot key={i} state={dotState(i)} />)}
                {!wizardPath && <StepDot state="active" />}
                <div style={{ marginLeft: 4 }}>
                  <div style={{ fontFamily: "var(--font-inter)", fontSize: 10, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: "#1254D9" }}>{stepLabel()}</div>
                  <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, color: "#111111" }}>{title}</div>
                </div>
              </div>
            </div>

            {/* Content area — ALL EXISTING STEP CONTENT GOES HERE, UNCHANGED */}
            <div className="wiz-body" style={{ flex: 1, background: "#FFFFFF", padding: "40px 44px", display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#1254D9", marginBottom: 10 }}>
                {stepLabel()}
              </div>
              <h2 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(22px,2.4vw,32px)", lineHeight: .95, letterSpacing: "-.5px", textTransform: "uppercase", color: "#111111", margin: "0 0 8px" }}>
                {title}
              </h2>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: "#6A6A6A", margin: "0 0 28px", lineHeight: 1.5 }}>
                {sub}
              </p>

              {/* ── Step content — COPY EXACTLY FROM EXISTING FILE, DO NOT MODIFY ── */}
              <div style={{ flex: 1 }}>
                {/* Step 1 */}
                {wizardStep === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <RadioCard selected={wizardPath === "flip"} onClick={() => setWizardPath("flip")}>
                      My parts need reformatting or organizing.
                    </RadioCard>
                    <RadioCard selected={wizardPath === "revoice"} onClick={() => setWizardPath("revoice")}>
                      My music needs rewrites or revoicings.
                    </RadioCard>
                  </div>
                )}

                {/* Steps 2–Review: COPY EXACTLY FROM EXISTING wiz-body content div — do not alter any logic */}
                {wizardStep === 2 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <input aria-label="Name" style={inputStyle} placeholder="Name *" value={wName} onChange={e => setWName(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <input aria-label="Email address" style={inputStyle} type="email" placeholder="Email *" value={wEmail} onChange={e => setWEmail(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <input aria-label="School or organization" style={inputStyle} placeholder="School / Organization *" value={wSchool} onChange={e => setWSchool(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                  </div>
                )}
                {wizardStep === 3 && wizardPath === "flip" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <input aria-label="Show name" style={inputStyle} placeholder="Show Name *" value={wShowName} onChange={e => setWShowName(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <input aria-label="Number of movements" style={inputStyle} type="number" min={1} placeholder="Number of Movements * (e.g. 3)" value={wMovements} onChange={e => setWMovements(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <input aria-label="Total number of instrument parts" style={inputStyle} type="number" min={1} placeholder="Total Number of Instrument Parts *" value={wNumParts} onChange={e => setWNumParts(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <select aria-label="Current format" style={{ ...inputStyle, color: wCurrentFormat ? "#141414" : "#A6A5A0" }} value={wCurrentFormat} onChange={e => setWCurrentFormat(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")}>
                      <option value="" disabled>Current Format of Your Parts *</option>
                      <option value="8.5×11 PDF parts">8.5×11 PDF parts</option>
                      <option value="Concert score only (no individual parts)">Concert score only (no individual parts)</option>
                      <option value="No parts provided at all">No parts provided at all</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}
                {wizardStep === 3 && wizardPath === "revoice" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <input aria-label="Show name" style={inputStyle} placeholder="Show Name *" value={wShowName} onChange={e => setWShowName(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <input aria-label="Number of movements" style={inputStyle} type="number" min={1} placeholder="Number of Movements * (e.g. 3)" value={wMovements} onChange={e => setWMovements(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <input aria-label="Total number of instrument parts" style={inputStyle} type="number" min={1} placeholder="Total Number of Instrument Parts *" value={wNumParts} onChange={e => setWNumParts(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <textarea aria-label="Source pieces" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} rows={3} placeholder="Source Pieces * — List the pieces included in your show" value={wSources} onChange={e => setWSources(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                  </div>
                )}
                {wizardStep === 4 && wizardPath === "revoice" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, color: "#111111", marginBottom: 10 }}>Which parts need work? *</div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <RadioCard selected={wPartsNeedWork === "all"} onClick={() => setWPartsNeedWork("all")} size="sm">All parts</RadioCard>
                        <RadioCard selected={wPartsNeedWork === "specific"} onClick={() => setWPartsNeedWork("specific")} size="sm">Specific instruments</RadioCard>
                      </div>
                    </div>
                    {wPartsNeedWork === "specific" && (
                      <input aria-label="Which instruments" style={inputStyle} placeholder="Which instruments? * (e.g. Trumpet 1, Alto Sax 2)" value={wSpecificInstruments} onChange={e => setWSpecificInstruments(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    )}
                    <textarea aria-label="Describe the issues" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} rows={4} placeholder="Describe the issues you're experiencing *" value={wIssuesDescription} onChange={e => setWIssuesDescription(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <div>
                      <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, color: "#111111", marginBottom: 10 }}>Is this a stock show or custom arrangement? *</div>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <RadioCard selected={wShowType === "stock"} onClick={() => setWShowType("stock")} size="sm">Stock show <span style={{ fontWeight: 400, color: "#5A5A5A" }}>(JW Pepper / Hal Leonard)</span></RadioCard>
                        <RadioCard selected={wShowType === "custom"} onClick={() => setWShowType("custom")} size="sm">Custom arrangement</RadioCard>
                      </div>
                    </div>
                  </div>
                )}
                {isFilesStep && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <input aria-label="Google Drive link" style={inputStyle} type="url" placeholder="Google Drive Link to Your Parts (optional)" value={wPartsLink} onChange={e => setWPartsLink(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <input aria-label="Deadline" style={inputStyle} type="date" value={wDeadline} onChange={e => setWDeadline(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", padding: 16, border: "1px solid #DCDBD7", background: "#F7F6F4" }}>
                      <input type="checkbox" checked={wExpress} onChange={e => setWExpress(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#1254D9", marginTop: 3, cursor: "pointer" }} />
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: "#2A2A2A", lineHeight: 1.5 }}>
                        <strong>Express Delivery:</strong> I need my parts delivered within 48 hours. <em>(Rush fee applied)</em>
                      </span>
                    </label>
                  </div>
                )}
                {isFinalStep && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <ReviewGroup title="How Can I Help?" rows={[{ label: "Service", value: wizardPath === "flip" ? "Flip Folder Conversion" : "Part Editing & Revoicing" }]} onEdit={() => goToStep(1)} />
                    <ReviewGroup title="About You" rows={[{ label: "Name", value: wName }, { label: "Email", value: wEmail }, { label: "School", value: wSchool }]} onEdit={() => goToStep(2)} />
                    <ReviewGroup title="Your Show" rows={[{ label: "Show Name", value: wShowName }, { label: "Movements", value: wMovements }, { label: "Parts Count", value: wNumParts }, ...(wizardPath === "flip" ? [{ label: "Current Format", value: wCurrentFormat }] : [{ label: "Source Pieces", value: wSources }])]} onEdit={() => goToStep(3)} />
                    {wizardPath === "revoice" && (
                      <ReviewGroup title="What Needs to Change?" rows={[{ label: "Parts", value: wPartsNeedWork === "all" ? "All parts" : "Specific instruments" }, ...(wPartsNeedWork === "specific" ? [{ label: "Instruments", value: wSpecificInstruments }] : []), { label: "Issues", value: wIssuesDescription }, { label: "Show Type", value: wShowType === "stock" ? "Stock show (JW Pepper / Hal Leonard)" : "Custom arrangement" }]} onEdit={() => goToStep(4)} />
                    )}
                    <ReviewGroup title="Files & Timeline" rows={[{ label: "Drive Link", value: wPartsLink }, { label: "Deadline", value: wDeadline }, { label: "Express", value: wExpress ? "Yes — 48-hour turnaround" : "No" }]} onEdit={() => goToStep(isFilesStep ? wizardStep : wizardPath === "flip" ? 4 : 5)} />
                  </div>
                )}
              </div>

              {/* Error */}
              {wizardError && (
                <div style={{ marginTop: 16, background: "#FEF2F2", border: "1px solid #FECACA", padding: "12px 16px" }}>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 500, color: "#CC3333" }}>{wizardError}</span>
                </div>
              )}

              {/* Nav bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingTop: 24, borderTop: "1px solid #E4E3DE" }}>
                {wizardStep > 1 ? (
                  <button onClick={handleBack} style={{ background: "transparent", color: "#111111", border: "1.5px solid #DCDBD7", padding: "12px 24px", fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.borderColor = "#111111")} onMouseLeave={e => (e.currentTarget.style.borderColor = "#DCDBD7")}>
                    Back
                  </button>
                ) : <div style={{ width: 1 }} />}
                <button
                  onClick={handleContinue}
                  disabled={!valid}
                  style={{ background: "#1254D9", color: "#fff", border: "1.5px solid #1254D9", padding: "12px 28px", fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase", cursor: valid ? "pointer" : "default", opacity: valid ? 1 : 0.38, pointerEvents: valid ? "auto" : "none", transition: "background .15s, border-color .15s" }}
                  onMouseEnter={e => { if (valid) { e.currentTarget.style.background = "#0E45B5"; e.currentTarget.style.borderColor = "#0E45B5"; } }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#1254D9"; e.currentTarget.style.borderColor = "#1254D9"; }}
                >
                  {isFinalStep ? "Send Inquiry" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}
```

Then close the `<section>` and remove the old mobile style block, replacing it with:

```tsx
    <style>{`
      @media (max-width: 900px) {
        .wiz-shell { flex-direction: column !important; min-height: 0 !important; }
        .wiz-sidebar { display: none !important; }
        .wiz-mobile-bar { display: block !important; }
        .wiz-body { padding: 24px 20px !important; }
      }
    `}</style>
  </section>
);
```

- [ ] **Step 2: Verify Screen 2 in browser**

Visit `http://localhost:3000/contact`. Click "Get a Quote":
- Should animate (fade + slide) into Screen 2
- Dark gradient background, "GET / IN / TOUCH" Anton heading top-left
- Socials + email bottom-left
- White wizard card right side, all steps functional
- "← All Options" button top-left returns to Screen 1 with animation

- [ ] **Step 3: Verify all wizard paths still work**

Walk through the flip path all the way to Review & Submit. Walk through the revoice path. Confirm no regressions in validation, field values, or submission.

---

### Task 4: Mobile responsive pass

**Files:**
- Modify: `app/components/ContactSection.tsx`

- [ ] **Step 1: Add mobile media query for Screen 2 grid**

Extend the `<style>` block at the bottom to include:

```tsx
<style>{`
  @media (max-width: 900px) {
    .wiz-shell { flex-direction: column !important; min-height: 0 !important; }
    .wiz-sidebar { display: none !important; }
    .wiz-mobile-bar { display: block !important; }
    .wiz-body { padding: 24px 20px !important; }
    .contact-screen2-grid {
      grid-template-columns: 1fr !important;
    }
    .contact-screen2-left {
      flex-direction: row !important;
      align-items: center !important;
      justify-content: space-between !important;
    }
  }
`}</style>
```

Add `className="contact-screen2-grid"` to the content grid div and `className="contact-screen2-left"` to the left column div in Screen 2.

- [ ] **Step 2: Verify on narrow viewport**

In DevTools, set viewport to 375px wide. Screen 1 cards should stack to 1 column (grid auto-fit handles this). Screen 2 should stack the left header above the wizard card.

---

## Self-Review Checklist

- [x] Screen 1 cards: Get a Quote (active), Send an Inquiry (locked), 2× Coming Soon (locked)
- [x] Clicking Get a Quote → transitions to Screen 2
- [x] "← All Options" back button → transitions to Screen 1, resets wizard
- [x] All existing wizard step content preserved exactly
- [x] All validation, state, submission logic untouched
- [x] Transition animation on both enter and exit
- [x] Placeholder dark gradient background (swap for real image later)
- [x] Socials (LinkedIn, Instagram, YouTube) + email bottom-left on Screen 2
- [x] Mobile responsive breakpoint for both screens
