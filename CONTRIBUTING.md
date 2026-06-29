# Contributing

Thanks for helping improve this API.

## Local Setup

```bash
npm install
npm run dev
```

## Checks

Run these before opening a pull request:

```bash
npm run check
npm run build
```

## Data Updates

- Keep stable `id` values whenever possible.
- Prefer adding new optional fields over changing existing response shapes.
- If an official or upstream asset URL is uncertain, keep `generatedIcon` as a fallback.
- Include the game version in data records when the item was introduced in a known version.

## Project Scope

This is an unofficial fan API. Do not add account scraping, private HoYoLAB cookie handling, or anything that requires users to share credentials.
