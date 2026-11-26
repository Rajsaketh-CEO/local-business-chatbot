# Local Business Chatbot Template

A single-page website with a built-in chatbot for local shops, cafes and clinics. It answers common customer questions (timings, menu and prices, location, offers, delivery, payments) and hands off to WhatsApp when it doesn't know the answer.

Built by Sakie, Warangal, India.

**Off Campus code: UVYZXN**

## What it does

- Shows whether the business is open right now, using its timings.
- Answers questions typed in plain language, plus one-tap quick replies.
- Links to Google Maps, phone call and WhatsApp ordering.
- Works on phones and desktops, with no backend and no API key.

## Reuse it for a new client

Open `config.js` and change the business name, address, phone, WhatsApp number, timings, menu, offers, delivery and payment details. Nothing else needs editing.

## Run it

Open `index.html` in a browser. To put it online for free, push this repo to GitHub, then go to Settings, Pages, and publish from the `main` branch.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure |
| `style.css` | Design |
| `config.js` | Business details (edit per client) |
| `chatbot.js` | Question matching and replies |

## Built with

HTML, CSS and vanilla JavaScript.

## Next steps

- Replace the keyword matching in `chatbot.js` with a call to an AI model through a small backend, so it can answer free-form questions.
- Add Telugu and Hindi replies.
