const WORDS = [
  "آب",
  "آسمان",
  "آتش",
  "ابر",
  "امید",
  "انسان",
  "ایران",
  "باد",
  "باران",
  "باغ",
  "برف",
  "بهار",
  "پرواز",
  "پنجره",
  "پیام",
  "تلاش",
  "توسعه",
  "جاده",
  "جهان",
  "حقیقت",
  "خورشید",
  "دریا",
  "درخت",
  "دل",
  "دوست",
  "راه",
  "رود",
  "رویا",
  "روز",
  "زمان",
  "زمین",
  "زیبا",
  "سفر",
  "سلام",
  "سنگ",
  "سکوت",
  "شادی",
  "شب",
  "صبح",
  "صدا",
  "طبیعت",
  "طلوع",
  "عشق",
  "علم",
  "فردا",
  "فرصت",
  "فصل",
  "فکر",
  "قلم",
  "قلب",
  "کار",
  "کتاب",
  "کوه",
  "کودک",
  "گل",
  "لبخند",
  "لحظه",
  "مردم",
  "مهر",
  "مهتاب",
  "موج",
  "نور",
  "نگاه",
  "هدف",
  "هوا",
  "یاد",
]; // 64 words => 6 bits

const te = new TextEncoder(),
  td = new TextDecoder();
const $ = (id) => document.getElementById(id);
const msg = $("msg");

function ok(t) {
  msg.textContent = "✔ " + t;
}
function err(t) {
  msg.textContent = "❌ " + t;
}
function info(t) {
  msg.textContent = "ℹ️ " + t;
}

// --- bit packing with LENGTH PREFIX ---
function bytesToWords(bytes) {
  const len = bytes.length >>> 0;
  const prefix = new Uint8Array([
    (len >>> 24) & 255,
    (len >>> 16) & 255,
    (len >>> 8) & 255,
    len & 255,
  ]);
  const data = new Uint8Array(4 + bytes.length);
  data.set(prefix, 0);
  data.set(bytes, 4);

  let bits = 0,
    buf = 0,
    res = [];
  for (const b of data) {
    buf = (buf << 8) | b;
    bits += 8;
    while (bits >= 6) {
      bits -= 6;
      res.push(WORDS[(buf >> bits) & 63]);
    }
    buf = buf & ((1 << bits) - 1);
  }
  if (bits > 0) res.push(WORDS[(buf << (6 - bits)) & 63]);
  return res.join(" ");
}

function wordsToBytes(text) {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) throw Error("ورودی خالی است");

  let bits = 0,
    buf = 0,
    out = [];
  for (const w of tokens) {
    const i = WORDS.indexOf(w);
    if (i < 0) throw Error("کلمه نامعتبر: " + w);
    buf = (buf << 6) | i;
    bits += 6;
    while (bits >= 8) {
      bits -= 8;
      out.push((buf >> bits) & 255);
      buf = buf & ((1 << bits) - 1);
    }
  }
  const all = new Uint8Array(out);
  if (all.length < 4) throw Error("داده کافی نیست");

  const len = ((all[0] << 24) | (all[1] << 16) | (all[2] << 8) | all[3]) >>> 0;
  const payload = all.slice(4);
  if (payload.length < len)
    throw Error("داده ناقص است (کلمات کم/زیاد شده یا دستکاری شده)");
  return payload.slice(0, len);
}

// --- Actions ---
// Encrypt: read plain(text) -> out(words)
async function encrypt() {
  msg.textContent = "";
  const text = $("plain").value;
  if (!text.trim()) {
    $("out").value = "";
    info("ورودی خالی است");
    return;
  }
  const key = $("pass").value || "";
  const payload = JSON.stringify({ t: text, k: key });
  $("out").value = bytesToWords(te.encode(payload));
  ok("رمزنگاری انجام شد (ورودی → خروجی)");
}

// Decrypt: read plain(words) -> out(text)
async function decrypt() {
  msg.textContent = "";
  const coded = $("plain").value;
  if (!coded.trim()) {
    $("out").value = "";
    info("ورودی خالی است");
    return;
  }
  const key = $("pass").value || "";
  const decoded = td.decode(wordsToBytes(coded));

  let obj;
  try {
    obj = JSON.parse(decoded);
  } catch (e) {
    throw Error("ورودی معتبر نیست یا ناقص است");
  }

  if (obj.k && obj.k !== key) throw Error("کلید نادرست است");
  $("out").value = obj.t ?? "";
  ok("رمزگشایی انجام شد (ورودی → خروجی)");
}

function swap() {
  [$("plain").value, $("out").value] = [$("out").value, $("plain").value];
  info("جابجا شد");
}

async function copyOut() {
  const v = $("out").value;
  if (!v.trim()) {
    info("چیزی برای کپی نیست");
    return;
  }
  await navigator.clipboard.writeText(v);
  info("کپی شد");
}

function clearForm() {
  $("plain").value = "";
  $("out").value = "";
  $("pass").value = "";
  info("فرم پاکسازی شد");
}

$("encBtn").addEventListener("click", () =>
  encrypt().catch((e) => err(e.message))
);
$("decBtn").addEventListener("click", () =>
  decrypt().catch((e) => err(e.message))
);
$("swapBtn").addEventListener("click", swap);
$("copyBtn").addEventListener("click", copyOut);
$("clearBtn").addEventListener("click", clearForm);
