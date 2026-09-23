# Video guide QA

- Source visual truth: user-provided reference image in this conversation (1505 × 610 px).
- Intended implementation: `src/App.tsx`, home route, immediately below the hero section.
- Intended viewport: desktop reference, 1505 × 610 px; responsive validation is implemented in the component with a one-column mobile and two-column desktop grid.
- Implementation screenshot: unavailable.
- Source density normalization: not applicable; the source is a chat attachment and no browser-rendered comparison image could be captured.
- State: initial, videos paused before user interaction; native controls visible.

## Findings

- [P1] Browser-rendered comparison unavailable
  - Location: local home route.
  - Evidence: the available in-app browser runtime returned `No browser is available` while opening the local implementation.
  - Impact: the reference and implementation cannot be compared as visible artifacts, so exact rendered spacing, typography, video crop, and responsive behavior remain unverified.
  - Fix: open the local home route in an available browser at the reference desktop viewport, capture the guide section, compare it with the supplied reference, then resolve any P0–P2 differences.

## Required fidelity surfaces

- Fonts and typography: implemented with the project’s existing Pretendard/Noto Sans KR stack; visual comparison blocked.
- Spacing and layout rhythm: the section uses a centered heading, 24–28 px card gap, 26 px card radius, and a one/two-column responsive grid; visual comparison blocked.
- Colors and visual tokens: blue guide heading and pale blue card frame/background are implemented; visual comparison blocked.
- Image and asset fidelity: both supplied MP4 assets are used directly with native video controls; visual comparison blocked.
- Copy and content: heading and both labels/captions match the supplied Korean reference intent; visual comparison blocked.

## Primary interactions tested

- TypeScript check: passed via `npm.cmd run lint`.
- Production build: passed via `npm.cmd run build`.
- Browser interaction, console review, and rendered screenshot: blocked because no browser is available in this environment.

## Implementation checklist

1. Capture the guide section in a browser at desktop and mobile widths.
2. Compare the capture to the reference and adjust any visible P0–P2 mismatch.
3. Update this report with visual evidence and set the final result accordingly.

final result: blocked
