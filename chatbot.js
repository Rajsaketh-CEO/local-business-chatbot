const B = BUSINESS;
const log = document.getElementById("log");
const form = document.getElementById("form");
const input = document.getElementById("input");
const chips = document.getElementById("chips");
const status = document.getElementById("status");

const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
function isOpenNow() {
  const d = new Date(), now = d.getHours() * 60 + d.getMinutes();
  return now >= toMin(B.hours.open) && now < toMin(B.hours.close);
}
const fmt = t => {
  let [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return h + (m ? ":" + String(m).padStart(2, "0") : "") + " " + ap;
};
const waLink = text =>
  `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(text)}`;

// Each intent: keywords to look for, and a function that builds the reply (HTML).
const INTENTS = [
  { chip: "Opening hours", words: ["hour", "open", "close", "timing", "time", "when"],
    reply: () => `We're open <b>${fmt(B.hours.open)} to ${fmt(B.hours.close)}</b>, every day. ${isOpenNow() ? "We're open right now." : "We're closed right now."}` },
  { chip: "Menu and prices", words: ["menu", "price", "cost", "chai", "coffee", "snack", "food", "eat", "rate"],
    reply: () => "Here's our menu:<ul>" + B.menu.map(i => `<li>${i.name}: ₹${i.price}</li>`).join("") + "</ul>" },
  { chip: "Location", words: ["where", "location", "address", "direction", "map", "reach"],
    reply: () => `You'll find us at <b>${B.address}</b>. <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/${encodeURIComponent(B.name + " " + B.city)}">Open in Maps</a>` },
  { chip: "Offers", words: ["offer", "discount", "deal", "student", "coupon"],
    reply: () => B.offers },
  { chip: "Home delivery", words: ["deliver", "home", "order", "parcel", "takeaway"],
    reply: () => `${B.delivery} <a target="_blank" rel="noopener" href="${waLink("Hi, I'd like to place an order.")}">Order on WhatsApp</a>` },
  { chip: "Payment options", words: ["pay", "upi", "card", "cash", "gpay", "phonepe"],
    reply: () => B.payments },
  { chip: "Talk to a person", words: ["call", "phone", "contact", "human", "owner", "number", "whatsapp"],
    reply: () => `Call us on <a href="tel:${B.phone.replace(/\s/g, "")}">${B.phone}</a> or <a target="_blank" rel="noopener" href="${waLink("Hi, I have a question.")}">message us on WhatsApp</a>.` },
  { words: ["hi", "hello", "hey", "namaste"],
    reply: () => `Hi! Ask me about our menu, timings, offers or delivery.` },
  { words: ["thank", "thanks", "ok", "great"],
    reply: () => "You're welcome. Anything else I can help with?" }
];

function match(text) {
  const t = " " + text.toLowerCase().replace(/[^a-z0-9₹ ]/g, " ") + " ";
  let best = null, bestScore = 0;
  for (const intent of INTENTS) {
    const score = intent.words.filter(w => t.includes(w.length <= 2 ? " " + w + " " : w)).length;
    if (score > bestScore) { best = intent; bestScore = score; }
  }
  return best;
}

function add(who, html, isText) {
  const el = document.createElement("div");
  el.className = "msg " + who;
  if (isText) el.textContent = html; else el.innerHTML = html;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}

function ask(text) {
  text = text.trim();
  if (!text) return;
  add("me", text, true);
  const typing = add("bot", '<span class="dots"><i></i><i></i><i></i></span>');
  const intent = match(text);
  setTimeout(() => {
    typing.innerHTML = intent
      ? intent.reply()
      : `I'm not sure about that one. <a target="_blank" rel="noopener" href="${waLink(text)}">Ask our team on WhatsApp</a> and they'll reply soon.`;
    log.scrollTop = log.scrollHeight;
  }, 450);
}

form.addEventListener("submit", e => { e.preventDefault(); ask(input.value); input.value = ""; });

// Page setup from config
document.title = B.name + " | Ask us anything";
document.getElementById("name").textContent = B.name;
document.getElementById("tagline").textContent = B.tagline;
document.getElementById("addr").textContent = B.address;
status.textContent = isOpenNow() ? `Open now, until ${fmt(B.hours.close)}` : `Closed, opens at ${fmt(B.hours.open)}`;
status.className = "status " + (isOpenNow() ? "on" : "off");
INTENTS.filter(i => i.chip).forEach(i => {
  const b = document.createElement("button");
  b.type = "button"; b.textContent = i.chip;
  b.onclick = () => ask(i.chip);
  chips.appendChild(b);
});
add("bot", `Welcome to ${B.name}. What would you like to know?`, true);
