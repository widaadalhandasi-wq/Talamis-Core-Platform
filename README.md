# Talamis — Full Stack

```
Talamis-Fullstack/
├── backend/      .NET 10 Web API (Talamis) — EF Core, Identity, JWT auth
└── frontend/     Angular v22 app, converted from the Figma/React export
```

## 1. Run the backend

```bash
cd backend/Talamis
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

It will listen on the URLs in `Properties/launchSettings.json`
(`https://localhost:64387` by default). Swagger UI is at `/swagger` in
development, with a "Bearer" auth button for testing protected endpoints.

Before running for real, replace the placeholder `Jwt:Key` in
`appsettings.json` with a long random secret, and point `ConnectionStrings:DefaultConnection`
at your actual SQL Server instance.

## 2. Run the frontend

```bash
cd frontend
npm install
npm start
```

Opens on `http://localhost:4200`. `src/environments/environment.ts` already
points at `https://localhost:64387/api` to match the backend's dev URL — update
it if your backend runs elsewhere.

## 3. How they're connected

- **CORS**: `backend/Talamis/Program.cs` has an `AngularDev` CORS policy allowing
  `http://localhost:4200` / `https://localhost:4200`. Add your deployed frontend
  origin there too once you have one.
- **Auth**: the Angular `AuthService` (`frontend/src/app/core/services/auth.service.ts`)
  calls `POST /api/auth/register` and `POST /api/auth/login`, stores the returned
  JWT in `localStorage`, and exposes it as a signal. An HTTP interceptor
  (`core/interceptors/auth.interceptor.ts`) attaches `Authorization: Bearer <token>`
  to every request going to `environment.apiUrl`. A route guard
  (`core/guards/auth.guard.ts`) redirects to `/login` if there's no session.
- **Data services**: `DailyPromptService`, `AudioContentService`, and
  `UserSubmissionService` (under `core/services/`) call the matching backend
  controllers, with TypeScript models under `core/models/` mirrored field-for-field
  from the backend DTOs.

## 4. Frontend structure

- `src/app/shell/` — the converted `App.tsx`: the phone-sized shell + bottom
  nav tab switcher (kept as a signal-based tab switch, not router-based, since
  that's how the original React app worked).
- `src/app/pages/dashboard|lessons|podcasts/` — the three Figma-exported
  screens, mechanically converted from JSX to Angular templates (verified
  tag-for-tag against the original: matching `<svg>`/`<path>`/`<div>` counts,
  and a full HTML tag-balance check). Each `.ts` file already injects and
  calls its matching backend service in `ngOnInit`, but **the markup itself is
  still the static Figma mockup** — only the Dashboard greeting name is wired
  live (`{{ firstName() }}`, pulled from the logged-in user). To make a
  screen fully dynamic, replace its hardcoded mock content with an `@for` loop
  over the signal the component already populates (e.g. `episodes()` in
  Podcasts, `mySubmissions()` in Lessons, `upcomingPrompts()` in Dashboard).
- `src/app/pages/login/` — a plain login/register form. The original design
  had no auth screen, so this one is new and unstyled-to-spec — feel free to
  reskin it to match.

## 5. Known gaps / next steps

- Screens show one hardcoded example of each content type (no `*ngFor`/`@for`
  lists yet) — turning them into real repeated lists needs a bit of design
  judgment about which card should repeat and how.
- No file upload flow yet for audio submissions (`UserSubmission.audioFileUrl`
  expects a URL — you'll need blob storage or a similar upload endpoint).
- No automated tests.
