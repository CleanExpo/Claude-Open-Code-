# AutoStream-Marketing | Architecture

## Core Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4.
- **Video Engine**: Remotion 4.0.
- **AI**: Gemini 2.0 Flash (via LangChain), Fal.AI (Picasso/DiCaprio).
- **Analysis**: Puppeteer (Web Scraping), GitHub API (Repo Analysis).

## Component Map
- `src/agents/`: Autonomous logic layers.
- `src/remotion/`: Video compositions and React-based frames.
- `src/app/api/`: Long-running task endpoints.
- `src/components/ui/`: Premium Shadcn-based interface elements.

## Data Flow
1. **User Input** (URL/Repo) -> `DirectorAgent`.
2. `DirectorAgent` -> Scrapes/Analyses -> Returns Personas.
3. **Persona Choice** -> `ScriptGen` -> Storyboard.
4. **Storyboard** -> `Picasso` (Images) & `DiCaprio` (Motion).
5. **Assets** -> `Remotion Rendering` -> MP4 Export.
