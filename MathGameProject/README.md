# Comics & Film Math Studio

A standards-aligned generator that turns Andrew's love for comic books and indie filmmaking into rigorous Grade 7 Common Core math problems. The app supports two modes:

- **Teacher Planning Mode** – curates ready-to-teach prompts with CCSS tags, solution paths, and extension ideas.
- **Player Mode** – speaks directly to Andrew with second-person storytelling and IRL tie-ins.

## Research Notes

| Focus Area | Authentic Insight | CCSS Connection |
| --- | --- | --- |
| Comic shop economics | Pull-box subscription agreements commonly discount 15–25%; Washington state sales tax averages 8.5%. Accurate math keeps store margins intact. | 7.RP.A.3 (multi-step percent problems), 7.EE.B.3 (multi-step calculations with rational numbers) |
| Collection management | Single issues are typically bound into trades every 5–6 chapters. Collectors track remainder issues to plan future buys. | 7.NS.A.3 (division with remainders, interpreting results in context) |
| Convention budgeting | Artists mix merchandise and production gear purchases; budgeting requires inequalities and combinations of rational numbers. | 7.EE.B.3, 7.EE.B.4 |
| Indie film scheduling | Storyboard and shot lists drive percent-complete progress charts before crews are hired. | 7.RP.A.3 |
| Equipment sharing | Student filmmakers regularly share rentals and apportion cost by usage ratio. | 7.RP.A.3 |
| Editing logistics | Runtime locks at festivals (e.g., 6-minute shorts) force linear equations with scene durations. | 7.EE.B.4 |
| On-set data | Tracking FX retakes or audio scenes per night generates data for means and variability. | 7.SP.B.4 |
| Collectible probability | Blind-bag comic variants are sold in known ratios, perfect for theoretical vs. experimental probability comparisons. | 7.SP.C.6 |

## Running the App

Open `index.html` in a modern browser. No build step is required.

## Customizing

- Add new generators to `app.js` by pushing an object to `generatorLibrary` with `context`, `skill`, `standards`, and a `generate` function.
- Update styling in `styles.css` (mobile-first responsive adjustments included).
- Extend standards references by editing `standardsCatalog` in `app.js`.

## Folder Structure

```
MathGameProject/
├── app.js          # Problem generators and UI logic
├── index.html      # Single-page app shell
├── styles.css      # Neon-inspired dashboard styling
└── README.md       # Research grounding and usage notes
```

Bring Andrew’s fandoms into the math classroom with authentic, high-engagement problems.
