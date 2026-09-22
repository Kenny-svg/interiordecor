# Imagine route — test cases

Base: `/imagine` as a guest. Mock camera is fine (`AI_IMAGE_PROVIDER=mock`).
Credits: 3 complimentary stills per day. 8s between charged runs.
Pass if the space picker leads to a live canvas, the desk stays usable, and nothing whitescreens.

---

## 0. Space + canvas (first)

| ID | Setup | Steps | Expect |
|---|---|---|---|
| C1 | Cold session | Open `/imagine`. | Picker first: Home, Office, A public room. No Compose yet. |
| C2 | Living room | Choose Living room. | Room opens dressed: laterite walls, sofa, lounge, table, rug, chandelier, sheers, evening light. Colour pickers at the top. Furniture is living-room kit. |
| C3 | Colour | Tap a wall colour square, or a scheme chip. | Walls take the colour. Canvas updates. |
| C4 | Style | Tap Garden city. | Walls go green. Sky reads as garden. Caption mentions garden city. |
| C5 | Constraints | Toggle evening light off, keep my windows on. | Warm wash leaves. Curtains pull aside. |
| C6 | Office | Change space → Private office. | Default office: desk, chairs, credenza, charcoal, blinds. Not a living-room kit. |
| C7 | Compose | With a space selected, Compose stills. | Four stills under the canvas. Credit 2 of 3. Note is optional. |
| C8 | Example | Click “Ikoyi living room”. | Space, Laterite colours, sofa + lounge + table, light, curtains, and note fill. |

---

## A. Write (after a space is chosen)

| ID | Setup | Steps | Expect |
|---|---|---|---|
| W1 | Space chosen, no note | Open Add a spoken or written note → Write. | Compose stills enabled from the space alone. Canvas shows the default dressed room. |
| W2 | Short note | Type fewer than 12 characters. | Compose stills stays enabled (the canvas is the brief). |
| W3 | Happy path | Optional 12+ characters. Optionally pick ≤3 style tags. Compose stills. | Button reads Composing. Four stills return. Credit 2 of 3. Send this to the studio appears. |
| W4 | Example seed | Click “Ikoyi living room”. | Canvas and note fill. Compose enabled. |
| W5 | Refine | On a ready still, click warmer. | That frame pulses. New version listed (Original / warmer). Credit drops. Other stills stay. |
| W6 | Safety | Write a note containing a blocked word (`nude`, `weapon`, …). Compose. | Designed caution. No stills. No credit spent. |
| W7 | Cooldown | Compose twice in under 8s. | Second run: “Give the last stills a moment…” Still on paper, not a white screen. |
| W8 | Keyboard | Tab through palette and furniture, then Compose stills, Enter. | Same as W3. Focus ring visible. |

---

## B. Voice (no photograph)

| ID | Setup | Steps | Expect |
|---|---|---|---|
| V1 | Mic allowed | Add a note → Voice → Record → speak 8–45s → Stop. | Timer. Waveform while recording. Transcript appears. Compose already enabled from the space. |
| V2 | Mic denied | Block the microphone. Record. | Caution: microphone blocked. “Paste a transcript below” remains. |
| V3 | No mic | Record on a machine with no input. | “No microphone was found.” Paste still works. |
| V4 | Paste only | Skip Record. Paste 12+ characters into Transcript. Compose. | Four stills. Source is voice. Write field may stay empty. |
| V5 | Edit words | After STT, change a dotted/uncertain word. Compose. | Edited transcript is what generates. |
| V6 | Re-record | Record, Stop, Re-record. | Transcript clears. Previous audio discarded. |
| V7 | 4th run | Three successful gens, then Compose again. | Compose gone. “Complimentary concepts are used.” Send this to the studio still works. |
| V8 | Handoff | After V7 (or any ready stills), Send this to the studio. | Lands on `/consult?from=…` with the Imagine brief strip. |

---

## C. Photo + direction

| ID | Setup | Steps | Expect |
|---|---|---|---|
| P1 | Tab only | Add a note → Photo + direction. No file, empty direction. | Compose still enabled from the space. Photograph optional; windows stay. |
| P2 | Direction only | Type 12+ characters. No file. Compose. | Four concept stills. No “room as it is” pair (no photo). |
| P3 | Photo + direction | Attach JPEG/PNG/WebP under 10MB. Type direction. Tick “keep my windows”. Compose. | Desk shows the photo. Wall: “Your architecture, imagined finishes.” Side by side: “The room as it is.” / “Concept 1, on that plan.” Then the four stills. |
| P4 | Bad file | Drop a PDF or a 11MB image. | Caution on the dropzone. File not kept. |
| P5 | Remove photo | Attach, then Remove photograph. Compose. | Pair disappears. Generate without architecture lock. |
| P6 | HEIC | Attach HEIC if the OS offers it. | Rejected or no preview. JPEG/PNG/WebP still work. |
| P7 | From a case study | Work → a room → Start from this look. | Space inferred from the room. Direction is the project brief. Tags from the project. |

---

## D. Shared (all modes)

| ID | Steps | Expect |
|---|---|---|
| S1 | Wide desktop | Print wall aligns with header. Paper (not stills) on the right. Frames not edge-to-edge. |
| S2 | 390px mobile | Picker, then desk then wall. Generate is in the desk flow, not a fixed bar over the fields. |
| S3 | Reduced motion | No pulsing frames. Page does not smooth-scroll. |
| S4 | Provider 502 | Fail generate (kill the key, or stub 502). | Notice on paper. Retry all. Not a white screen. |
| S5 | Consult without Imagine | `/consult` with empty Imagine session. Send a letter. | Confirmation. No brief strip required. |
