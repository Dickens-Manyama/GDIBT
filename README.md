# Green Defence Bamboo Initiative Tanzania

A modern Node.js + Express + EJS website for the Green Defence Bamboo Initiative Tanzania (GDBI), representing the strategic partnership between UNLOCK GROUP LIMITED Tanzania and JWAPANO Bamboo Tanzania.

## What is included

- Responsive multi-page marketing website
- Bamboo industrialization and environmental restoration storytelling
- News system with article routes
- Admin-ready authentication flow
- MongoDB-ready models and contact capture
- Bootstrap 5, AOS, GSAP, Swiper, and Chart.js front-end integration

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with values such as:

```env
PORT=3000
SESSION_SECRET=replace-with-a-secure-secret
JWT_SECRET=replace-with-a-secure-secret
ADMIN_EMAIL=admin@gdbi.tz
ADMIN_PASSWORD=ChangeMe123!
MONGO_URI=mongodb://127.0.0.1:27017/gdbi
```

3. Start the server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Notes

- The hero video and some media references are scaffolded and should be replaced with the actual initiative assets.
- The admin panel is wired for secure routing but still needs real content management screens if you want a complete CMS.
- News content currently uses seeded editorial entries and can be connected to MongoDB collections at any time.
