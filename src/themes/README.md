# Adding a new game UI theme

Instructions for an LLM (or a person) adding a new **UI Theme** to Statly, usually after the user
shares a **Game UI Database** link (`https://www.gameuidatabase.com/gameData.php?id=…`).

Existing themes, for reference: `hades`, `p3r` (Persona 3 Reload), `p4` (Persona 4 Golden),
`p5` (Persona 5), `cyberpunk` (Cyberpunk 2077), `ff7r` (Final Fantasy VII Remake),
`mgs` (Metal Gear Solid), `rdr2` (Red Dead Redemption 2), and `ink-marker` (not a game: Copic
marker + G-pen ink, which uses the user's own theme color, color mode and font).

Follow the repo's `CLAUDE.md`: plan first, check in with the user, keep changes small, then
summarize.

---

## 1. Research the game's UI

1. **Open the Game UI Database page in the browser** (Claude in Chrome), not WebFetch; the
   site returns 403 to plain fetches. Scroll the "Title and Settings", "Modals and Text", "Game
   States" and "Stats and Resources" sections. Click into 2–3 screens (Settings/Options, a modal,
   a list/selection screen) to see them full-size.
2. **Write down what you see**, concretely:
   - background (color, gradient, texture, vignette, scanlines, grain…)
   - panel/box shape and border (thin line? thick frame? cut corners? slanted?)
   - **how selection looks** (highlight bar? outline? filled tag? black band?). This is the
     most recognizable part of a game's UI; reuse it for selected buttons, tabs, sidebar current
     page and hovered menu rows.
   - title/heading style and **casing** (only use caps if the game really does)
   - accent colors (take hex values from the screenshots)
   - decorative motifs (corner nodes, diamonds, tabs, brush strokes, sparkles…)
3. **Find the game's font.** Search "<game> UI font" (Fonts In Use, GameFontLibrary, forums).
   Game fonts are usually proprietary, so pick the **closest free (OFL) match**:
   - past matches: Optima → Belleza, RDR Lino → Kirsty, Skip Std B → M PLUS Rounded 1c,
     New Rodin → M PLUS 1p, Hapna Slab Serif → Zilla Slab, Trajan → Cinzel.
   - it must have **upper and lower case** unless the game truly only uses caps.
4. **Report back to the user before building**: summarize the look, how Statly would look
   (page, titles, cards, buttons, tabs, sidebar, modals, dropdowns, cursors, icon), and the file
   list. Wait for approval.

## 2. Assets

- **Fonts: bundle locally. Never call the Google Fonts API.**
  `npm pack @fontsource/<font>` into the scratchpad, copy only the needed
  `…-latin-<weight>-normal.woff2` files into `src/assets/fonts/<Font_Name>/` with the `LICENSE`
  as `OFL.txt`, write `src/fonts-css/<font>.css` (`@font-face`, `font-display: swap`) and import
  it in `src/fonts.ts`. Check first whether the font is already bundled.
- **Picker icon: the game's real desktop icon from Steam.**
  `curl -s https://api.steamcmd.net/v1/info/<appid>` → grab `"clienticon"`, download
  `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/<appid>/<hash>.ico`,
  convert with `sips -s format png x.ico --out x.png`, resize `sips -Z 128`, and save to
  `src/assets/themes/icons/<key>.png`. Look at it (Read the PNG) to confirm it's right.
- **Cursors: hand-draw two 32×32 SVGs** in `src/assets/themes/cursors/`: `<key>.svg` (arrow)
  and `<key>-pointer.svg` (a **pointing hand**, since hover must look like a hovered mouse; reuse
  the hand path from `hades-pointer.svg`). Only use a non-hand hover if the game's cursor isn't
  mouse-shaped (Cyberpunk's square). Make cursors **opaque with a dark outline**, because
  see-through cursors disappear over same-colored UI. Hotspots: arrow tip `3 2`, hand fingertip `12 2`.
- **Decorative art: hand-draw small SVGs** in `src/assets/themes/<key>/` if needed (frames,
  tags, textures). Use `border-image` 9-slice for frames so corners don't distort.

## 3. Wire it up (small edits)

| File | Change |
| --- | --- |
| `src/contexts/useThemeContext.tsx` | add `<key>: '<accent hex>'` to `GAME_THEME_COLORS` (forces the accent, dark mode, and the theme's own fonts). Add the key to `LIGHT_GAME_THEMES` if the game's UI is light (like P4). |
| `src/components/SidebarModal/UiThemeList.tsx` | add `{ key, label, icon: iconUrl('<key>.png') }` in the order the user wants |
| `src/components/SidebarModal/FontFamilyList.tsx` | add the new font(s) to the list and to `FONT_USED_IN` |
| `src/themes/<key>.css` | the theme (see below). **Create this file before adding its import.** |
| `src/pages/+Wrapper.tsx` | `import '../themes/<key>.css';` |

`useFocusRecordCardColors.tsx` already gives every game theme a dark card fill with light text.
Only touch it for a light theme (P4 returns a cream fill).

**Order matters for the dev server:** create a new CSS/asset file *before* adding the `import`
that points to it (and remove imports *before* deleting files). Otherwise Vite caches a
"file not found" error and every route returns 500 until the file is touched.

## 4. Writing `src/themes/<key>.css`

Scope **every** rule to `[data-ui-theme='<key>']`. Copy the structure of an existing theme
(`ff7r.css`, `rdr2.css` or `mgs.css` are good templates) and restyle it. Start with a header
comment describing the look and naming the fonts.

### Marker classes (already in the components; target these, don't add new markup)
- `.ui-theme-card`: Focus Record / Completed Tasks cards (also carry `bg-[var(--theme-color)]`!)
- `.bg-color-gray-600.rounded-lg.p-3`: Stats panels
- `.ui-theme-plate`: Stats summary strip / date pickers (`.py-2`, `.p-4`) and the **chosen
  Medal/Challenge panel** (`.mt-5.overflow-auto`, which is itself a scroll container)
- `.ui-theme-tile`: Medal / Challenge tiles (`button[role=radio]`, `aria-checked` when selected)
- `.ui-theme-sidebar`: main menu, Settings and Filter sidebars
- `.ui-theme-tooltip`, `.absolute.top-full.z-50.bg-color-gray-600` (dropdowns),
  `.bg-color-gray-600.border-color-gray-150.shadow-xl` (context menus / toasts)
- `dialog:not(.ui-theme-sidebar) > div:first-child:not(.ui-theme-bare)`: modal panels.
  `.ui-theme-bare` wrappers inside dialogs must be made invisible (no double frames).
- Buttons: selected = `.bg-[var(--theme-color)]`, unselected = `.bg-color-gray-300`
  (both `button` **and** `a`, because the Stats and Medals/Challenges tabs are links).
  Tabs: `nav[aria-label='Stats sections'] > *` and `[role='tablist'] [role='tab']`.

### Checklist of things every theme needs
- [ ] Root: accent/color variables, re-map `--color-gray-*`, `color-scheme`, `font-family`,
      `scrollbar-color`.
- [ ] Page background; make `.min-h-screen/.flex-1/.flex.justify-center.bg-color-gray-700`
      transparent and give `.sticky.bg-color-gray-700` an opaque-ish background.
- [ ] Titles (`h1`) and headings; square corners (`.rounded…` → 0, keep `rounded-full`).
- [ ] Cards, Stats panels, plates, tiles, modals, sidebars, popups, buttons, tabs, inputs,
      `hr` dividers, `::-webkit-scrollbar`, `::selection`, cursors.
- [ ] **Hover feedback on everything selectable** (the user expects it): unselected controls,
      tabs, menu rows, plain links / icon buttons. Exclude `.ui-theme-tile` from generic hover
      rules because tiles have their own hover.
- [ ] Chart "empty" areas tinted to the palette: `.apexcharts-heatmap-rect[fill='#2f2f2f' i]` and
      `.recharts-bar-background-rectangle` (CSS `fill` overrides the JS color).
- [ ] Loading skeletons inside cards (`.ui-theme-card .animate-pulse`) get a soft tint.
- [ ] Chosen Medal/Challenge panel: `overflow-x: hidden`, plus some padding if bordered.
- [ ] No page watermark/side labels unless the user wants them (they found them distracting).

## 5. Pitfalls we hit (avoid them)

- **Never `clip-path` a container that holds dropdowns** (cards, panels); it clips the ⋯ menus.
  Draw slants and frames with `::before`/`::after` or SVG backgrounds instead. `clip-path` is
  fine on buttons.
- **Stacking:** giving panel children `position: relative; z-index` traps open dropdowns
  under later content. Lift the child/panel that `:has(.absolute.top-full.z-50)` (see `p5.css`).
- **`border` shorthand resets `border-image`**: use longhand `border-width/style/color` with
  `!important` when overriding Tailwind borders on elements that use `border-image`.
- **Decorations sticking out of a scroll container** (corner nodes, cut corners) cause a
  horizontal scrollbar or float mid-content. Keep them inside, or hide them on
  `.ui-theme-plate.overflow-auto`, or draw them on the wrapper via `:has(> .ui-theme-plate…)`.
- **Cards carry the theme-color class.** Any rule that styles `.bg-[var(--theme-color)]`
  (e.g. "dark text on accent fills") must add `:not(.ui-theme-card)`.
- **Readable colors:** don't put the accent on the same-colored background (yellow on yellow,
  red icons on a red sidebar, green icon on a green selected tag). Also re-color inline-styled
  accent icons (`[style*='rgb(…)']`) and `hover:text-[var(--theme-color)]` /
  `hover:border-[var(--theme-color)]` states, and text inside black "selection bands".
- **Casing:** only `text-transform: uppercase` where the game itself uses caps.
- **Font size / accessibility:** theme text must read at least as large as the site's default
  font at the same size. Measure in the browser (width of the same 16px line in the default vs.
  the theme font, and x-height) and set `font-size-adjust` on the theme root. Exclude display
  fonts that are already large (big caps titles). `src/index.css` makes form controls inherit
  it, keeps Material Symbols icons at `font-size-adjust: none`, and shrinks the medal "x" in
  themes. Very thin pixel fonts may also need a minimum size for 12–14px text (see `mgs.css`).
- **Light-mode themes:** add to `LIGHT_GAME_THEMES`; components read the *effective*
  `colorMode` from the theme context, so charts pick light-mode colors automatically.
- **Mobile:** check long tab/button rows don't overflow with wide fonts; wrap them only in that
  theme, not globally. Avoid backgrounds on 1px `<hr>`; use a 1px `border-top` with
  `border-image` (some mobile browsers don't paint it).

## 6. Verify

1. `npx tsc --noEmit`, and `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/focus-records`
   → 200.
2. Preview in the browser on Focus Records, Completed Tasks, Stats (all 3 tabs), Medals,
   Challenges, a sidebar, a modal and a dropdown. The user's saved theme may overwrite your
   preview: set `document.documentElement.dataset.uiTheme = '<key>'` again after the page
   loads (and set `--theme-color` for the preview).
3. Report honestly what you checked and what you didn't. Nothing is committed unless the
   user asks.
