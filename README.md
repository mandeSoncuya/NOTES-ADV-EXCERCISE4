# Archives of Eldoria (Next.js)

High-fantasy note app built with Next.js + React + TypeScript.
The whole app lives in one file: `pages/index.tsx` (TSX, internal CSS, inline SVG icons).

## Features
- **Login page (`/`)** with validation:
  - Email must not be empty and must be a `@gmail.com` address
  - Password must be more than 6 characters
  - Error message shown below the Login button (plus per-field errors)
  - Goes to the Notes page when every check passes
- **Notes page:** add, view, update and delete notes, `useEffect` duplicate-title check, separate `NoteItem` component
- **Logout** button returns to the login screen

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000

Test login: `wizard@gmail.com` / any password longer than 6 characters.

## Notes
- Tailwind is loaded from its CDN in `<Head>` so no extra config files are needed (internet required).
- To change the password rule, edit `MIN_PASSWORD_LENGTH` at the top of `pages/index.tsx`.
