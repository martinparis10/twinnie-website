# Twinnie Design System

## 1. Purpose and source authority

Design the Twinnie shopper experience: a calm, welcoming place to create a digital twin and understand how clothing fits. The interface should feel like a considered fashion brand, with clear instructions and useful controls.

Brand foundation verified against the local Twinnie brand board and website on September 16, 2026. Layout, sizing, interaction and component guidance below are proposed product extensions of that foundation, not previously approved brand rules.

Sources:
- Brand board: `/Users/martinparis/Downloads/Green Aesthetic Fashion Studio Style Guide Brand Board (3).png`. Despite its generic filename, this image contains the Twinnie wordmark, typography and three-color palette.
- Additional board: `/Users/martinparis/Downloads/Green Aesthetic Fashion Studio Style Guide Brand Board.png`. It repeats the core identity but includes two additional swatches whose printed hex labels do not visually match their fills. Do not adopt those additional colors without clarification.
- Existing implementation: `/Users/martinparis/TWINNIE/website/src/app/globals.css` and `layout.tsx`.
- Product authority: Twinnie Build Charter, explicitly confirmed by Martin on September 15, 2026. Accuracy comes first. Alpha is an invitation-only website with manually prepared garments. Streaming versus browser rendering remains an engineering decision.

When using this file in Stitch or another design tool, preserve the verified palette and typography. Treat the proposed UI values as consistent starting defaults, adjustable through testing. This file defines the appearance and experience; it does not choose a rendering engine.

## 2. Visual character

Warm, quiet, editorial and approachable. Cream backgrounds give the product room to breathe. Charcoal provides structure and readable text. Dusty rose supplies a small, recognizable accent. Serif headings provide personality; simple sans-serif instructions keep the experience usable.

The shopper's body and the garment are the focal point. Give them the largest useful area. Keep surrounding controls compact and clear. Use open space, restrained borders and purposeful grouping. Avoid decorative dashboards, neon effects, heavy gradients, glass panels and excessive floating cards.

## 3. Verified brand colors

| Name | Hex | Intended UI role — proposed |
| --- | --- | --- |
| Cream | `#FAF7F2` | Default page, capture and viewer background; text on charcoal |
| Charcoal | `#1C1917` | Primary text, icons, primary action background, selected controls |
| Dusty rose | `#C08B7E` | Signature accent, second wordmark dot, selected decorative emphasis |


Use charcoal text on cream for the main reading surface. Use cream text on charcoal for primary buttons. Dusty rose is too light for small text on cream or for a small cream label on a rose button; use charcoal labels on rose. Do not make color the only indication of selection, error or progress.

Proposed supporting treatments:
- Panels: cream or white when a separate surface is useful.
- Decorative dividers: charcoal at roughly 12% opacity; do not depend on these faint lines to identify essential controls.
- Secondary text: charcoal at roughly 70% opacity on cream; verify the final rendered contrast.
- Field boundaries and important icons: stronger charcoal treatment than decorative dividers.
- Focus: clearly visible charcoal outline with an offset from the component; on dark surfaces use cream.
- Status: pair a plain-language label with an icon. Any additional success, warning or error hue is a functional extension that needs contrast checking, not a new brand accent.

## 4. Verified typography

**Headings: Libre Baskerville.** Use regular weight for the editorial character; bold sparingly for emphasis. Keep titles in sentence case and allow natural wrapping.

**Body and interface: Josefin Sans.** Use regular for reading and semibold for actions and labels. The existing website loads weights 300, 400, 600 and 700. Avoid light weight for essential capture instructions, form labels or small text.

Proposed scale:

| Role | Mobile | Desktop | Guidance |
| --- | --- | --- | --- |
| Marketing hero | 36–44 px | 56–72 px | Libre Baskerville, approximately 1.15 line height |
| Product page title | 28–32 px | 32–40 px | Libre Baskerville, approximately 1.2 line height |
| Section title | 22–24 px | 24–28 px | Libre Baskerville |
| Body / instructions | 16–18 px | 16–18 px | Josefin Sans, approximately 1.5 line height |
| Buttons / inputs | 16 px | 16 px | Josefin Sans, clear labels |
| Supporting text | 14 px | 14 px | Short, readable and sufficiently contrasted |

Use widely spaced uppercase only for brief editorial labels. Keep instructions, errors, navigation and buttons in sentence case. Avoid forcing a small type size to fit a layout.

## 5. Wordmark and brand motifs

The board shows a lowercase `twinnie` wordmark in a serif style, with the first i-dot charcoal and the second i-dot dusty rose. Preserve the supplied mark's proportions and spacing. Use an approved logo asset when available; a typed recreation is a prototype placeholder.

Place the wordmark on an uncluttered cream surface by default. Keep space around it; a practical proposed minimum is the height of one lowercase letter. Do not add a period, new icon, gradient, shadow or animation to the mark. Some older website references use punctuation; the board is the visual reference for this file.

The board's charcoal and rose circles can inform occasional editorial decoration. Keep them out of camera guides, measurement displays and areas where they could be mistaken for controls or status indicators.

## 6. Layout and spacing — proposed

Use an 8 px spacing rhythm, with 4 px for fine adjustments. Standard gaps: 8, 16, 24, 32, 48 and 64 px.

- Mobile: 20–24 px page padding, a single primary column and natural vertical scrolling.
- Desktop onboarding: a focused content column of roughly 480–560 px, with an optional instructional image alongside it.
- Desktop try-on: large viewer plus a garment/control panel of roughly 320–380 px. Allow the proportions to respond to viewport size.
- Mobile try-on: viewer first, with garment and size controls below or in a sheet that can be collapsed. Keep the garment visible while choosing a size.
- Editorial pages: comfortable text measure, generous section spacing and a maximum content width near 1200 px.
- Do not copy the marketing site's global overflow lock into forms or onboarding. People must be able to scroll when text grows or the keyboard opens.

Use 12–16 px corners for inputs, cards and grouped surfaces. Use pill shapes for primary actions and compact selection chips. Use shadows only when needed to distinguish an overlay from the page.

## 7. Components — proposed

### Buttons

Primary: charcoal fill, cream label, semibold Josefin Sans, pill shape, at least 48 px high. Give each step one obvious primary action.

Secondary: cream surface, charcoal label and a visible outline. Text actions are suitable for Back, Edit and Cancel when placement makes their purpose clear.

Rose may highlight a secondary promotional action with a charcoal label. Keep emphasis consistent within a screen. Hover, pressed, loading, disabled and keyboard-focus states must be distinguishable. Loading preserves the button width and includes a useful action label.

Examples: “Continue”, “Take front photo”, “Retake photo”, “Create my twin”, “Try this on”.

### Forms

Place persistent labels above inputs. Show units next to numeric measurements and make unit conversion explicit. Keep entries after recoverable errors. Explain the correction beside the affected field; placeholders do not replace labels.

Only ask for inputs required by the selected capture pipeline. Do not invent biometric questions or claim a photo count before engineering confirms the capture route.

### Garment cards and sizes

Show a clear garment image, name, color and available sizes. Selected sizes use a strong outline or charcoal fill plus an explicit selected state. Unavailable sizes remain identifiable and cannot be submitted. Do not use a changed thumbnail or a decorative size label as evidence that a new physical size was simulated.

### Viewer controls

Provide labeled controls for rotate, zoom and reset view, with touch and keyboard alternatives where feasible. Keep controls away from the torso and garment edges. Use neutral, stable lighting so color, silhouette and fit remain interpretable. Do not tint garments or skin to match the rose brand accent.

### Dialogs and sheets

Use a clear title, a visible close/back action and logical focus order. Return focus to the triggering control on close. Reserve confirmation dialogs for actions with meaningful consequences; ordinary navigation should remain immediate.

## 8. Alpha shopper flow — proposed

1. **Invitation and account:** explain the test experience and the next step in a few lines.
2. **Capture preparation:** illustrate the required framing, clothing, lighting and pose. Follow the actual measurement pipeline's protocol.
3. **Capture and review:** guide one view at a time. Show actionable retake reasons, such as feet outside the frame. Preserve accepted photos when only one needs replacing.
4. **Twin creation:** show genuine stage/status information and a recoverable failure path. Display a time estimate only when supported by current measurements; avoid invented percentages or guaranteed completion times.
5. **Twin review:** let the shopper inspect the body and report a mismatch. Explain limitations in ordinary language. A generic fallback body must never be presented as their accurate personal twin.
6. **Try-on:** keep garment, color and size selection clear. Identify which result is currently displayed while a different selection loads. Support rotation, zoom and repeat selection.
7. **Feedback:** ask a small number of useful questions about body resemblance, garment appearance and problems encountered. Do not present subjective resemblance as proof of sizing accuracy.

Design empty, waiting, ready, error and retry states alongside the successful path. Include interrupted uploads, rejected captures, failed twin creation, unavailable garments and failed drapes. Use the same brand treatment across all states.

Alpha uses manually prepared garments. Brand dashboards, garment-authoring interfaces, shopping assistants and cross-brand browsing are separate future surfaces; do not add them to the initial shopper flow by default.

## 9. Voice and content — proposed

Warm, direct, body-neutral and specific. Address the shopper as “you”. Explain what to do and why it matters. Use “digital twin” with a short explanation on first use: “a 3D model of your body”. Use “twin” thereafter.

Prefer:
- “Step back until your whole body is in the frame.”
- “We couldn't read this photo clearly. Keep your arms slightly away from your body and try again.” Follow the capture protocol for the exact pose.
- “Your twin is being created.”
- “The new size is still loading. You're viewing size M.”
- “Something looks wrong? Tell us what you notice.”

Avoid body judgments, unverified size recommendations, guaranteed return reductions, “perfect fit”, or claims that a twin is exact. Keep engine names, branch names, solver settings and infrastructure details out of shopper-facing copy.

Explain actual photo use and retention accurately. Do not invent privacy promises such as immediate deletion unless the implemented policy supports them.

## 10. Motion, accessibility and responsive behavior — proposed

Use brief, restrained transitions of about 150–250 ms for buttons, panels and state changes. Respect reduced-motion preferences. Keep camera capture stable and never use a rotating model as the only way to inspect a garment.

Support readable text, visible focus, labeled controls, keyboard operation, sensible screen-reader order and clear error announcements. Aim for touch targets of at least 44 × 44 px, with 48 px as the normal button height. Validate contrast in the final implementation, including hover and disabled states. Maintain usability with enlarged text and narrow screens.

A 3D view needs textual context: garment name, chosen size, processing status and relevant limitations. Important controls must remain usable when the canvas cannot load.

## 11. Instructions for design generation

Generate Twinnie screens using the verified three-color palette and the exact font pairing. Preserve a consistent header, typography scale, button system and spacing across screens. Prioritize a large usable body/garment view and clear capture guidance.

Start with the Alpha shopper flow in section 8. Show mobile and desktop adaptations and the key waiting/error states. Use clearly identified placeholder bodies and garments until real assets are available. Do not fabricate accuracy scores, fit heatmaps, live measurements, operational capabilities or brand partners.

Keep the result simple enough to implement and test. Refinement should improve comprehension, capture quality and confidence in what is actually shown.
