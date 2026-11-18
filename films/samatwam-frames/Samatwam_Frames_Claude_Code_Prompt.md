# Samatwam Frames: Claude Code prompt

Paste everything below into Claude Code, run from an empty folder. Put the style board image (`style_board.png`) in the project root as a reference.

---

You are the motion director for **Samatwam Frames**: 18 clips of five seconds each. Each clip explains one aspect of Samatwam that the launch film does not cover, and each uses a different visual style. Together they form one luxurious series under the **Liquid Night** system: liquid gradients, premium glass and fine HUD hairlines on deep night. Build everything as code in Remotion and render it. Stop after each phase and show me the result.

## Rules
1. No generated imagery of any kind: no text-to-image, image-to-video, AI upscaling, stock photos or downloaded HDRIs. Every pixel comes from code: type, vectors, shaders, procedural noise and 3D built from primitives.
2. The reference images set the mood only. Do not copy their layouts, logos, photographs or text.
3. One accent per clip (saffron). Gold #B08D3C appears only on work that is proven or held.
4. Liquid and glass must look physical: real refraction, a 1 px rim, a specular top edge and soft inner shadow. Use no neon, no lens flares, and bloom only at or below 0.15.
5. Write custom easing curves. Every clip ends on a hold of at least 18 frames.
6. Any figure that is not real is tagged ILLUSTRATIVE on screen.
7. Keep CREDITS.md listing every package, font and sound with its licence.

## Liquid Night system
- **Palette:** Night #0A0B0E, Navy #13213D, Blue #1F3A7A, Saffron #D9822B, Light saffron #F2B766, Gold #B08D3C (held only), Text #ECE8DF, Glass fill rgba(255,255,255,0.06–0.16), Rim rgba(255,255,255,0.28)
- **Type:** Space Grotesk (display), Playfair Display italic (one word of emphasis at most), JetBrains Mono (HUD labels, 0.12em tracking, uppercase). All OFL.
- **Frame chrome:** Notched bezel: a rounded frame whose top notch carries SAMATWAM · FRAMES · NN / 18, saffron hairlines with node dots in the corners, and a side rail of three progress dots.
- **Glass:** LiquidGlass panel: backdrop blur 22 px, saturate 1.4, SVG feTurbulence + feDisplacementMap refraction at the edges, a specular top gradient and a 1 px rim. 3D glass: drei MeshTransmissionMaterial (ior 1.45, chromatic aberration 0.03, roughness 0.05).
- **Liquid:** GLSL domain-warped fBm noise in night, navy, saffron and light saffron that moves slowly (one full cycle across 5 s). SVG metaballs for liquid button fills.
- **Finish:** Seeded film grain at 3%, a 6% vignette, and CameraMotionBlur on fast moves only.
- **Timing:** 5 s = 150 frames at 30 fps. Frames 0–30 reveal, 30–110 the idea in motion, 110–150 a hold carrying the title line.
- **Formats:** Master 3840×2160 ProRes 4444 (alpha kept where useful); web 1920×1080 H.264; vertical 1080×1920 recomposed from the same components, not cropped.

## Tools
- **Remotion (latest stable):** Timeline and frame-accurate render. Free for individuals and companies of up to 3 people; larger companies need a licence (remotion.dev/license).
- **@remotion/three, three, @react-three/drei, @react-three/postprocessing:** Glass objects, point clouds, extrusions, depth of field
- **@remotion/noise, @remotion/paths, @remotion/transitions, @remotion/motion-blur, @remotion/google-fonts:** Organic motion, stroke drawing, transitions, motion blur, fonts
- **d3-delaunay, qrcode:** Voronoi panes (clip 11); a real QR code (clip 04)
- **lemo-opuscar (github.com/lemomo-ai/lemo-opuscar):** DIRECTOR.md method; the style folders named per clip are grammar references; its audio tools for original stings
- **FFmpeg:** Mux, −14 LUFS loudness, encodes, contact sheet

## Clips (150 frames each at 30 fps)

### F01 · To think is the real skill
- **Aspect:** Samatwam's core belief: the skill is the decision you take with a tool, not the tool itself.
- **Style:** Focus | Blur (custom, from the saffron-navy poster reference)
- **Frames 0–30:** A liquid saffron and navy gradient fills the frame, fully out of focus. A thin diagonal line draws corner to corner.
- **Frames 30–100:** On the navy side, tool names (CAD, FEA, CFD, LLM, SIMULATION) drift past, soft and unreadable. On the saffron side the word DECIDE pulls from 40 px blur to sharp as the liquid settles. Three small glass droplets sit on the diagonal and refract the colours behind them.
- **Frames 100–150:** Hold. Tool names stay soft; only the decision is sharp.
- **Title line:** "To think is the real skill."
- **Build:** GLSL domain-warped noise for the liquid field; animated CSS blur on type; droplets as drei MeshTransmissionMaterial spheres (or SVG lens via feDisplacementMap).
- **Sound:** Low sub swell; one glass tick when DECIDE comes into focus.

### F02 · The full bandwidth
- **Aspect:** Builders see the whole range of execution, from idea to recalibration, not just one tool step.
- **Style:** Layered Panes (custom, from the layered-planes reference)
- **Frames 0–30:** Six thin glass panes stand in three-quarter view with even gaps, labelled in mono: IDEA, RESEARCH, ENGINEERING PROOF, GOVERNING FRAMEWORK, INTERFACE & MARKET, RECALIBRATION.
- **Frames 30–120:** A loose point cloud (the idea) travels through the panes. At each pane it gains structure: scatter, then contour lines, then wireframe, then a ruled grid, then a clean UI card.
- **Frames 120–150:** The camera turns 8° to reveal a hairline arc that carries the result back to the first pane. The loop closes.
- **Title line:** "Six layers between an idea and reality."
- **Build:** @remotion/three: thin RoundedBox panes with MeshPhysicalMaterial (transmission 1, roughness 0.08); instanced points with precomputed target positions per pane.
- **Sound:** A soft air pass at each pane, rising in pitch.

### F03 · The womb
- **Aspect:** Samatwam does not add features every day. It places classes of concepts today, and they grow features through conversation with the field.
- **Style:** flow-field (lemo-opuscar)
- **Frames 0–40:** Thousands of fine flow lines in warm grey and saffron stream across the dark frame.
- **Frames 40–110:** The lines bend round an invisible attractor and form an oval membrane. Inside it, six small seeds sit still: five hexagons and one octagon.
- **Frames 110–150:** Each time a line touches the membrane, the nearest seed grows one fine branch. Hold on the six seeds, each with new growth.
- **Title line:** "Classes placed today. Features grown with the field."
- **Build:** Seeded curl noise from @remotion/noise drawn on canvas; the membrane is an SDF attractor; seed branches are short L-system strokes drawn with evolvePath.
- **Sound:** Breathing low pad and two soft heartbeats at 60 BPM.

### F04 · Claim card and SAMT ticket
- **Aspect:** Every builder carries a personal claim card and a QR-linked ticket with an address (SAMT01/001), the platform's own engagement language.
- **Style:** glass-product (lemo-opuscar)
- **Frames 0–40:** A 4 mm glass card turns from edge-on to face-on above a dark floor and throws soft caustics.
- **Frames 40–110:** Etched into the card: CLAIM · SAMT01/001, a real QR code, and a claim typed underneath: "Bracket holds 2 kN at 40% less mass."
- **Frames 110–150:** The card flips. On the back, four stage pips; only the first (Claimed) is lit in saffron.
- **Title line:** "Claim · SAMT01/001"
- **Build:** drei RoundedBox with MeshTransmissionMaterial (ior 1.45, chromatic aberration 0.03, thickness 0.4); studio light from drei Lightformers (no downloaded HDRI); QR from the qrcode npm package; drei Text for etching.
- **Sound:** Glass slide, then one soft clink as the card lands face-up.

### F05 · Three interface layers
- **Aspect:** Each layer of the platform speaks its own visual language: Individual is Generative, Authority is Sustainative, Institutional is Transmittive.
- **Style:** desktop-flythrough (lemo-opuscar)
- **Frames 0–50:** The camera glides over a dark tabletop of glass cards. The Individual card rises; shapes grow on it (Generative).
- **Frames 50–100:** The Authority card rises; its gauges hold steady at level (Sustainative).
- **Frames 100–150:** The Institutional card rises; lines travel outward from it to small nodes (Transmittive). Each card shows three sub-member tabs.
- **Title line:** "One platform. Three languages."
- **Build:** CSS 3D transforms with perspective inside Remotion; each card is a React component styled as a LiquidGlass panel.
- **Sound:** Three UI ticks, each a step higher.

### F06 · Your AI, your data
- **Aspect:** Learners plug in their own AI through an API. Their computed data stays with them; only key project metrics are shared.
- **Style:** security-xray (lemo-opuscar)
- **Frames 0–40:** A project case slides along a conveyor towards a scanner gate. A plug label reads YOUR MODEL · API, connected.
- **Frames 40–110:** In x-ray view the case is full of dense outlines: raw data, files, model weights. At the gate only three small metric tags pass through a slot to the platform side: LOAD 2.0 kN · MASS −40% · TESTS 3/3.
- **Frames 110–150:** The case returns, untouched, to the owner's side. Hold.
- **Title line:** "Your model. Your data. You choose what to prove."
- **Build:** 2D layered SVG; x-ray tint as light saffron and white on navy; the gate is a LiquidGlass slab with a scan line.
- **Sound:** Scanner hum and three short beeps, one per tag.

### F07 · Simulation Arena
- **Aspect:** A full arena for Physical AI: machines are trained in multi-simulation before they exist.
- **Style:** lidar-survey (lemo-opuscar)
- **Frames 0–50:** A scan plane sweeps the dark and reveals a robot work cell as points: a six-axis arm, a conveyor, parts.
- **Frames 50–120:** Three ghost copies of the arm run pick-and-place in parallel, each slightly different.
- **Frames 120–150:** The three copies converge into one smooth motion. Mono label: CELL 01 · 3 PARALLEL RUNS.
- **Title line:** "Simulation Arena. Train machines before they exist."
- **Build:** The arm is built from primitives in @remotion/three; MeshSurfaceSampler turns it into points, revealed by distance from the scan plane. No vendor logos on screen.
- **Sound:** LiDAR sweep ticks and a low servo whir.

### F08 · Thought to prototype
- **Aspect:** A transition layer turns a developed thought into a real hardware prototype, linked to Physical AI and a manufacturing route.
- **Style:** precise-mechanism (lemo-opuscar)
- **Frames 0–40:** One pencil-weight line draws a gripper.
- **Frames 40–110:** The lines thicken into colour-coded parts (saffron, blue, light saffron, white), extrude into 3D and snap together precisely.
- **Frames 110–150:** The gripper closes once. Tags step across the bottom: SKETCH → CAD → SIM → PROTOTYPE.
- **Title line:** "From a thought to a part you can hold."
- **Build:** SVG paths drawn with evolvePath, then the same paths through ExtrudeGeometry in @remotion/three.
- **Sound:** Pencil scratch, then three crisp mechanical clicks.

### F09 · Certified creation
- **Aspect:** Open Research gives works made with AI an independent certificate, so people can claim their ideas and build a real record.
- **Style:** gilded-illumination (lemo-opuscar)
- **Frames 0–40:** A dark vellum page. A thin illuminated border draws itself from Samatwam geometry: hexagons, an octagon, the sun.
- **Frames 40–110:** Two claim lines are written. Next to the first a check appears: PROOF REPRODUCED. The second stays in plain ink: NOT YET TESTED.
- **Frames 110–150:** Only now does gold run along the border, and only beside the proven line. A seal presses: CERT · OR-2027-0117.
- **Title line:** "Claim your idea. Prove it. Own the record."
- **Build:** Procedural vellum from noise; an original ornament (no copied manuscript art); gold sheen as a moving anisotropic highlight, used only on the proven line.
- **Sound:** Quill strokes and one low bell on the gold.

### F10 · Engineering cases
- **Aspect:** Real problems solved with engineering proofs: FEA, CFD and lattice design.
- **Style:** thermal-camera (lemo-opuscar), recoloured
- **Frames 0–40:** A bracket in a thermal view, using a night → navy → saffron → light saffron ramp, not a rainbow. A load arrow presses down.
- **Frames 40–110:** A hotspot glows at the fillet. A lattice infill grows inside the part and the hotspot cools.
- **Frames 110–150:** Readout: MAX STRESS falls. Small mono tag: ILLUSTRATIVE CASE.
- **Title line:** "Engineering cases. Real loads. Real proofs."
- **Build:** A scalar field (distance-based) drives a colour-ramp shader on the mesh; the lattice is instanced struts. Marked as illustrative, because it is not a real solver run.
- **Sound:** A rising thrum that eases as the part cools.

### F11 · Open learning
- **Aspect:** Learners build something of their own instead of passing quizzes: biomimicry, structural dissection, biosensors.
- **Style:** stained-glass (lemo-opuscar)
- **Frames 0–50:** A leaf in stained glass: the lead lines are its veins, with panes of light saffron, navy and blue lit from behind.
- **Frames 50–120:** The lead lines lift off, straighten and become the ribs of a canopy structure; the panes become its glass panels.
- **Frames 120–150:** Hold on the canopy.
- **Title line:** "Study the leaf. Build the roof."
- **Build:** Panes are Voronoi cells (d3-delaunay) and the venation is an L-system; the morph uses matched point sets.
- **Sound:** Glass shimmer and one piano note.

### F12 · Creative Arena
- **Aspect:** Agent-assisted films and reels about Bharat, made by its creators; selected works go into an open series.
- **Style:** Octagon Portholes (custom, from the porthole-window reference)
- **Frames 0–40:** A dark bulkhead with a ring of octagon windows (the Creative Arena shape).
- **Frames 40–110:** Each window plays a different procedural scene: ink-wash river, a kolam drawing itself, monsoon rain lines, festival lights as particles, a dawn horizon.
- **Frames 110–150:** The camera pushes into one window, which becomes a film frame with a slate: OPEN SERIES · EPISODE 01.
- **Title line:** "Creative Arena. Stories of Bharat, by its creators."
- **Build:** SVG octagon masks over small canvas or shader scenes, all procedural. No photographs.
- **Sound:** A short santoor phrase and a projector click on the slate.

### F13 · The requirements loop
- **Aspect:** Teachers and industry post requirements, agents route them to Samatwam-certified learners, and the work comes back delivered.
- **Style:** hologram-hud (lemo-opuscar), from the orbital-HUD reference
- **Frames 0–40:** A hairline HUD. A ringed node on the left is labelled REQUIREMENT and one on the right DELIVERY. Small lettered orbs (learners) sit along the axis.
- **Frames 40–110:** A packet leaves REQUIREMENT. Routing lines branch to three learner orbs, which light up as the best fit. A saffron waveform forms between them.
- **Frames 110–150:** The result reaches DELIVERY. Mono: REQ-0081 · ROUTED 3 / 40 · DUE 14 D.
- **Title line:** "Posted by teachers and industry. Built by certified learners."
- **Build:** SVG HUD: 1 px hairlines, dashed arcs and tick scales. Accents are saffron only.
- **Sound:** Data chirps over a low pulse.

### F14 · Tools built with earned tokens
- **Aspect:** Students earn tokens and spend them building the platform's tools. They submit the toolchains, libraries, skills and connectors they used as an agentic history.
- **Style:** iso-infographic (lemo-opuscar)
- **Frames 0–40:** An isometric workbench. Checklist items tick, and a token counter fills.
- **Frames 40–110:** Each token spent drops a block onto a stack: LIBRARY, SKILL, CONNECTOR. The stack becomes a tool.
- **Frames 110–150:** A side log scrolls the agentic history. The finished tool gets a glass label.
- **Title line:** "Earn tokens. Build the tools. Keep the history."
- **Build:** Isometric SVG blocks with drop-and-settle springs; the log is mono text in a LiquidGlass panel.
- **Sound:** Soft wooden ticks, never casino sounds.

### F15 · Transcendence phase
- **Aspect:** Tools are tested against real data, rated by peers, and combined with other tools into new repos.
- **Style:** oscilloscope-math (lemo-opuscar)
- **Frames 0–50:** A phosphor oscilloscope: a saffron trace on a navy grid. Trace A is real data and trace B is a tool's output, out of phase.
- **Frames 50–110:** Trace B tunes until it overlaps A. Five peer-rating markers tick in.
- **Frames 110–150:** A second tool's trace C appears. B and C add into a new waveform, labelled NEW REPO.
- **Title line:** "Tested against reality. Rated by peers. Combined into something new."
- **Build:** Canvas traces with phosphor persistence (decaying frame buffer).
- **Sound:** Two oscillators tuning into a clean fifth.

### F16 · The hive network
- **Aspect:** At the end of each cohort, tools join into a network you can query. Because tools build on existing libraries, each answer costs fewer tokens.
- **Style:** dark-keynote (lemo-opuscar)
- **Frames 0–50:** A black stage. Glass hexagon cells, each one a tool, assemble into a honeycomb.
- **Frames 50–120:** A question is typed into a glass search bar. Only four cells light up as the answer travels through them and back.
- **Frames 120–150:** Hold on the honeycomb with its four lit cells.
- **Title line:** "Every cohort leaves a hive. Ask it what it has built."
- **Build:** Instanced hexagonal prisms with a transmission material; the path lights with an emissive pulse; the search bar is a LiquidGlass input.
- **Sound:** A low hive hum and a single chime on the answer.

### F17 · Vision modules
- **Aspect:** The vision of the individual is valued highest. Each quarter, vision modules that pass the seven streams and the six disciplines go to government and industry.
- **Style:** art-deco (lemo-opuscar)
- **Frames 0–40:** An art-deco sunburst of seven rays in light saffron: the seven streams.
- **Frames 40–110:** A tall module card rises through seven ray gates and six chevrons, and each one clicks as it passes.
- **Frames 110–150:** Its seal turns gold only once every gate is passed. Mono: VISION MODULE · Q1 2027 · GOVERNMENT · INDUSTRY.
- **Title line:** "The vision of the individual, valued highest."
- **Build:** SVG deco geometry with strict symmetry; gate checks are stroke fills; gold is used only on the final seal.
- **Sound:** A brass swell and a short deco sting.

### F18 · Four Es for schools
- **Aspect:** How Samatwam works with schools: Enable perception, Engage interest, Enhance sense of control, and Educate Samatwam, where the institution learns from its students.
- **Style:** Liquid Glass UI (custom, from the liquid-UI references)
- **Frames 0–40:** Four premium glass pill buttons sit on a slow liquid saffron and navy field, inside the notched series frame.
- **Frames 40–110:** A liquid blob slides from button to button and fills Enable, then Engage, then Enhance.
- **Frames 110–150:** At Educate Samatwam the flow reverses: liquid runs from the student side back into the Samatwam sun mark.
- **Title line:** "Enable. Engage. Enhance. Educate Samatwam."
- **Build:** LiquidGlass and GlassButton components; the blob is an SVG metaball (feGaussianBlur plus feColorMatrix threshold).
- **Sound:** Liquid swells, three glass taps, and a lower fourth tap.

## Phases
1. **Setup.** Scaffold a Remotion TypeScript project named samatwam-frames. Clone lemo-opuscar and read AGENTS.md, DIRECTOR.md and TECHNIQUE.md. Build the shared kit in src/kit/: tokens.ts, LiquidField (shader), LiquidGlass, GlassButton, Metaball, NotchedFrame, Grain, HudLine, MonoLabel.
2. **Kit check.** Render one 1920×1080 still of the kit and compare it with the style board. Show me.
3. **Treatment.** Write treatment.md with one paragraph per clip, plus cue_map.md, following DIRECTOR.md.
4. **Stills.** Render frame 75 and frame 140 of every clip and assemble an 18×2 contact sheet. Show me.
5. **Clips.** Build the clips one at a time as compositions F01 to F18. After every six, render low-resolution previews and show me.
6. **Sound.** Make an original 5 s sting per clip with lemo-opuscar's audio tools or CC0 sources, at −14 LUFS.
7. **Master, on my go.** Render out/master/F01…F18 (4K ProRes), out/web/ (1080p H.264), out/vertical/ (1080×1920), and one 90 s reel with all 18 cut on a 120 BPM grid, using 2-frame glass-wipe transitions.

## Quality check
- Pause on any frame: does it look like a premium product interface, made by hand? If it looks generic, generated or templated, redo it.
- No two clips share a dominant motion.
- Gold appears only where the clip says it may.
- Text reads clearly on a phone in the vertical cut.
- The glass refracts what is behind it; nothing is a flat translucent box.
- CREDITS.md is complete, and npm run build renders every clip with one command.
