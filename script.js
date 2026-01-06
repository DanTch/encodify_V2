const WORDS_64 = [
  "آب", "آسمان", "آتش", "ابر", "امید", "انسان", "ایران", "باد", "باران", "باغ",
  "برف", "بهار", "پرواز", "پنجره", "پیام", "تلاش", "توسعه", "جاده", "جهان", "حقیقت",
  "خورشید", "دریا", "درخت", "دل", "دوست", "راه", "رود", "رویا", "روز", "زمان",
  "زمین", "زیبا", "سفر", "سلام", "سنگ", "سکوت", "شادی", "شب", "صبح", "صدا",
  "طبیعت", "طلوع", "عشق", "علم", "فردا", "فرصت", "فصل", "فکر", "قلم", "قلب",
  "کار", "کتاب", "کوه", "کودک", "گل", "لبخند", "لحظه", "مردم", "مهر", "مهتاب",
  "موج", "نور", "نگاه", "هدف", "هوا", "یاد",
];

const WORDS_POOL = [
  "زندگی", "آرامش", "محبت", "مهربانی", "دوستی", "امروز", "اکنون", "آینده", "باور", "شوق",
  "انگیزه", "توان", "حرکت", "رشد", "پیشرفت", "اندیشه", "خرد", "دانش", "آگاهی", "پیروزی",
  "تجربه", "تمرین", "توجه", "امتحان", "پایداری", "یاری", "همراه", "همسفر", "رهایی", "آغاز",
  "پایان", "خاطره", "داستان", "تصویر", "نقش", "راز", "حس", "احساس", "دیدار", "گفتگو",
  "پرسش", "پاسخ", "آواز", "ترانه", "نغمه", "رنگ", "عطر", "خانه", "خانواده", "دوام",
  "مسیر", "قدم", "گام", "ساحل", "افق", "سپیده", "پرتو", "روشنایی", "گرما", "نسیم",
  "سایه", "پناه", "سپاس", "لب", "چشم", "دست", "خنده", "لبخند", "یادگار", "بیداری",
  "بخشش", "امانت", "شکوفه", "آبی", "زرین", "سپید", "سبز", "سرخ", "نقره", "بلور",
  "چشمه", "جوی", "آبشار", "دشت", "کشتزار", "پرنده", "آهو", "ماه", "ستاره", "خورشید",
  "صبحگاه", "شامگاه", "بارقه", "آذرخش", "رعد", "برق",
];

const EMOJI_POOL = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🙂", "😉", "😊", "😇", "😍", "😘", "😗",
  "😙", "😚", "😋", "😛", "😜", "😝", "😎", "🤓", "🧐", "🤗", "🤔", "😐", "😑", "🙄", "😬",
  "😌", "😔", "😪", "😴", "🥳", "💛", "💚", "💙", "💜", "🧡", "🤍", "🖤", "💘", "💝", "💖",
  "💗", "💓", "💞", "💕", "💟", "❣", "💯", "✨", "🌟", "⭐", "⚡", "🔥", "💧", "🌈", "🌙",
  "🌍", "🌎", "🌏", "🌸", "🌼", "🌻", "🌺", "🌷", "🌹", "🥀", "🌿", "🍀", "🌱", "🌳", "🌲",
  "🌴", "🌵", "🍁", "🍂", "🍃", "🌊", "⛰", "🏔", "🏕", "🎈", "🎉", "🎊", "🎁", "🏆", "🎯",
  "🎵", "🎶", "📌", "📍", "🧭", "⏰", "📅", "📝", "📚", "📖", "✏", "🧠", "🔑", "🔒", "🔓",
  "🛡", "⚙", "🔧", "🔨", "🧰", "🔬", "💡", "🔦", "📷", "🎥", "📱", "💻", "🖥", "🛰", "🚀",
  "✈", "🚗", "🚲", "🚶", "🏃", "🧘", "🤝", "👏", "🙌", "🙏", "🌞", "☀", "☁", "🌧", "❄",
  "🌨", "⛅", "⛈", "🌦", "🌤",
];

function isSafeWord(w) {
  return /^[\u0600-\u06FF]+$/.test(w);
}
function isSafeEmoji(e) {
  if (e.includes("\u200D")) return false;
  if (e.includes("\uFE0F")) return false;
  if (/\s/.test(e)) return false;
  return true;
}

function pickUnique(list, n, predicate) {
  const out = [];
  const seen = new Set();
  for (const x of list) {
    if (predicate && !predicate(x)) continue;
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x);
    if (out.length === n) break;
  }
  return out;
}

const WORDS = (() => {
  const merged = [...WORDS_64, ...WORDS_POOL];
  const picked = pickUnique(merged, 128, isSafeWord);
  if (picked.length !== 128)
    throw new Error("Not enough safe Persian words: " + picked.length);
  return picked;
})();

const EMOJIS = (() => {
  const picked = pickUnique(EMOJI_POOL, 128, isSafeEmoji);
  if (picked.length !== 128)
    throw new Error("Not enough safe emojis: " + picked.length);
  return picked;
})();

const TOKENS = [...WORDS, ...EMOJIS];
if (TOKENS.length !== 256) throw new Error("TOKENS must be 256");

const TOKEN_TO_INDEX = new Map(TOKENS.map((t, i) => [t, i]));

const te = new TextEncoder();
const td = new TextDecoder();

const $ = (id) => document.getElementById(id);

// --- Toast Notification Logic ---
function showToast(message, type = "info") {
  const container = $("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "ℹ️";
  if (type === "success") icon = "✔";
  if (type === "error") icon = "✖";
  
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  // حذف خودکار بعد از ۳ ثانیه
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// جایگزین توابع قدیمی
function ok(t) { showToast(t, "success"); }
function err(t) { showToast(t, "error"); }
function info(t) { showToast(t, "info"); }

// --- UI Logic: Tabs ---
const tabs = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));
    
    tab.classList.add("active");
    $(tab.dataset.target).classList.add("active");
  });
});

// --- UI Logic: Drag & Drop ---
const dropZone = $("dropZone");
const fileInput = $("fileIn");
const fileNameDisplay = $("fileNameDisplay");

dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    fileNameDisplay.textContent = "انتخاب شد: " + fileInput.files[0].name;
    validateFile(fileInput.files[0]);
  }
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    fileNameDisplay.textContent = "انتخاب شد: " + e.dataTransfer.files[0].name;
    validateFile(fileInput.files[0]);
  }
});

function validateFile(file) {
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  if (file.size > MAX_SIZE) {
    showToast("⚠️ هشدار: فایل بزرگتر از ۵۰ مگابایت است و ممکن است مرورگر کند شود.", "error");
  }
}

// --- UI Logic: Progress Bar ---
const progressContainer = $("progressContainer");
const progressBar = $("progressBar");
const progressText = $("progressText");

function updateProgress(percent) {
  progressContainer.style.display = "block";
  progressBar.style.width = percent + "%";
  progressText.textContent = percent + "%";
  
  // اجازه به UI برای آپدیت شدن
  return new Promise(resolve => setTimeout(resolve, 10));
}

function resetProgress() {
  setTimeout(() => {
    progressContainer.style.display = "none";
    progressBar.style.width = "0%";
  }, 2000);
}

// --- Core Logic ---

function bytesToTokens(bytes) {
  const len = bytes.length >>> 0;
  const data = new Uint8Array(4 + len);
  data[0] = (len >>> 24) & 255;
  data[1] = (len >>> 16) & 255;
  data[2] = (len >>> 8) & 255;
  data[3] = len & 255;
  data.set(bytes, 4);

  const out = [];
  for (const b of data) out.push(TOKENS[b]);
  return out.join(" ");
}

function tokensToBytes(text) {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) throw new Error("ورودی خالی است");

  const out = new Uint8Array(tokens.length);
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const idx = TOKEN_TO_INDEX.get(t);
    if (idx === undefined) throw new Error("توکن نامعتبر: " + t);
    out[i] = idx;
  }

  if (out.length < 4) throw new Error("داده کافی نیست");
  const len = ((out[0] << 24) | (out[1] << 16) | (out[2] << 8) | out[3]) >>> 0;
  const payload = out.slice(4);
  if (payload.length < len) throw new Error("داده ناقص/دستکاری شده");
  return payload.slice(0, len);
}

async function gzipCompress(u8) {
  if (!("CompressionStream" in window)) return u8;
  const cs = new CompressionStream("gzip");
  const stream = new Blob([u8]).stream().pipeThrough(cs);
  const ab = await new Response(stream).arrayBuffer();
  return new Uint8Array(ab);
}

async function gzipDecompress(u8) {
  if (!("DecompressionStream" in window)) return u8;
  const ds = new DecompressionStream("gzip");
  const stream = new Blob([u8]).stream().pipeThrough(ds);
  const ab = await new Response(stream).arrayBuffer();
  return new Uint8Array(ab);
}

function randBytes(n) {
  const u = new Uint8Array(n);
  crypto.getRandomValues(u);
  return u;
}

async function deriveKey(pass, salt) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    te.encode(pass),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function packData(inputUint8, pass, onProgress) {
  if(onProgress) await onProgress(10); // شروع

  const gz = await gzipCompress(inputUint8);
  if(onProgress) await onProgress(40); // فشرده‌سازی انجام شد

  const useGzip = gz.length < inputUint8.length;
  const payload = useGzip ? gz : inputUint8;

  const version = 1;
  const encrypted = !!pass;
  const flags = (encrypted ? 1 : 0) | (useGzip ? 2 : 0);

  if (!encrypted) {
    const out = new Uint8Array(2 + payload.length);
    out[0] = version;
    out[1] = flags;
    out.set(payload, 2);
    if(onProgress) await onProgress(80);
    return out;
  }

  const salt = randBytes(16);
  const iv = randBytes(12);
  const key = await deriveKey(pass, salt);
  if(onProgress) await onProgress(60); // کلید ساخته شد

  const cipherAB = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    payload
  );
  const cipher = new Uint8Array(cipherAB);

  const out = new Uint8Array(2 + 16 + 12 + cipher.length);
  out[0] = version;
  out[1] = flags;
  out.set(salt, 2);
  out.set(iv, 18);
  out.set(cipher, 30);
  
  if(onProgress) await onProgress(90); // رمزنگاری تمام شد
  return out;
}

async function unpackData(bytes, pass, onProgress) {
  if(onProgress) await onProgress(10);

  if (bytes.length < 2) throw new Error("داده خراب است");
  const version = bytes[0];
  const flags = bytes[1];
  if (version !== 1) throw new Error("نسخه پشتیبانی نمی‌شود");

  const encrypted = (flags & 1) === 1;
  const compressed = (flags & 2) === 2;

  let payload;
  if (!encrypted) {
    payload = bytes.slice(2);
    if(onProgress) await onProgress(50);
  } else {
    if (!pass) throw new Error("کلید لازم است");
    if (bytes.length < 31) throw new Error("داده ناقص است");

    const salt = bytes.slice(2, 18);
    const iv = bytes.slice(18, 30);
    const cipher = bytes.slice(30);

    const key = await deriveKey(pass, salt);
    if(onProgress) await onProgress(40);

    let plainAB;
    try {
      plainAB = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipher
      );
    } catch {
      throw new Error("کلید نادرست است یا داده دستکاری شده");
    }
    payload = new Uint8Array(plainAB);
    if(onProgress) await onProgress(70);
  }

  const raw2 = compressed ? await gzipDecompress(payload) : payload;
  if(onProgress) await onProgress(90);
  return raw2;
}

// ---- عملیات متن ----

async function encryptText() {
  const text = $("plain").value;
  if (!text.trim()) {
    $("out").value = "";
    info("ورودی خالی است");
    return;
  }
  const pass = ($("pass").value || "").trim();
  
  const raw = te.encode(text);
  const bytes = await packData(raw, pass); // بدون پروگرس بار برای متن
  
  const outputText = bytesToTokens(bytes);
  $("out").value = outputText;

  // کپی خودکار در کلیپ‌بورد
  try {
    await navigator.clipboard.writeText(outputText);
    ok("متن رمزنگاری و به‌صورت خودکار کپی شد");
  } catch (err) {
    // اگر کپی خودکار به هر دلیلی کار نکرد، فقط پیام رمزنگاری نمایش داده شود
    console.error("Copy failed", err);
    ok("متن رمز شد (کپی خودکار انجام نشد)");
  }
}

async function decryptText() {
  const coded = $("plain").value;
  if (!coded.trim()) {
    $("out").value = "";
    info("ورودی خالی است");
    return;
  }
  const pass = ($("pass").value || "").trim();
  
  try {
    const bytes = tokensToBytes(coded);
    const raw = await unpackData(bytes, pass);
    const text = td.decode(raw);
    $("out").value = text;
    ok("متن بازگشایی شد");
  } catch (e) {
    err(e.message);
  }
}

// ---- عملیات فایل ----

function downloadBlob(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

async function processFileEncrypt() {
  const fileInput = $("fileIn");
  if (!fileInput.files.length) {
    info("لطفا ابتدا یک فایل را در کادر بالا رها کنید یا انتخاب کنید");
    return;
  }
  
  try {
    const file = fileInput.files[0];
    validateFile(file); // چک کردن دوباره سایز

    await updateProgress(5);
    
    const arrayBuffer = await file.arrayBuffer();
    await updateProgress(20);
    
    const bytes = new Uint8Array(arrayBuffer);
    const pass = ($("pass").value || "").trim();

    // ارسال تابع updateProgress برای آپدیت شدن در حین کار
    const packedBytes = await packData(bytes, pass, updateProgress);
    
    const tokenString = bytesToTokens(packedBytes);
    await updateProgress(100);

    downloadBlob(tokenString, file.name + ".encoded.txt", "text/plain");
    ok(`فایل رمز شد و دانلود گردید (${tokenString.length.toLocaleString()} کاراکتر)`);
    resetProgress();
  } catch (e) {
    err(e.message);
    resetProgress();
  }
}

async function processFileDecrypt() {
  const fileInput = $("fileIn");
  if (!fileInput.files.length) {
    info("لطفا ابتدا فایل متنی رمز شده را انتخاب کنید");
    return;
  }

  try {
    const file = fileInput.files[0];
    await updateProgress(5);

    const text = await file.text();
    await updateProgress(20);

    const pass = ($("pass").value || "").trim();

    const bytes = tokensToBytes(text);
    const originalBytes = await unpackData(bytes, pass, updateProgress);
    
    await updateProgress(100);

    let originalName = file.name.replace(".encoded.txt", "").replace(".txt", "");
    if(!originalName.includes(".")) originalName += ".bin";

    downloadBlob(originalBytes, "decrypted_" + originalName, "application/octet-stream");
    ok("فایل رمزگشایی شد و دانلود آغاز شد");
    resetProgress();
  } catch (e) {
    err(e.message);
    resetProgress();
  }
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
  ok("کپی شد");
}

function clearForm() {
  $("plain").value = "";
  $("out").value = "";
  $("pass").value = "";
  $("fileIn").value = "";
  $("fileNameDisplay").textContent = "";
  info("پاک شد");
}

// Share API logic
const shareBtn = $("shareBtn");
if (navigator.share) {
  shareBtn.style.display = "block";
  shareBtn.addEventListener("click", async () => {
    const text = $("out").value;
    if (!text) return info("متنی برای اشتراک‌گذاری وجود ندارد");
    try {
      await navigator.share({
        title: "Encodify Output",
        text: text
      });
      ok("به اشتراک گذاشته شد");
    } catch (err) {
      console.log(err);
    }
  });
}

// لیسنرهای دکمه‌های متن
$("encBtn").addEventListener("click", () =>
  encryptText().catch((e) => err(e.message))
);
$("decBtn").addEventListener("click", () =>
  decryptText().catch((e) => err(e.message))
);
$("swapBtn").addEventListener("click", swap);
$("copyBtn").addEventListener("click", () =>
  copyOut().catch((e) => err(e.message))
);
$("clearBtn").addEventListener("click", clearForm);

// لیسنرهای دکمه‌های فایل
$("fileEncBtn").addEventListener("click", processFileEncrypt);
$("fileDecBtn").addEventListener("click", processFileDecrypt);

// ==========================================
// بخش مربوط به PWA و نصب آفلاین
// ==========================================

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => console.log("SW registered:", reg.scope))
      .catch((err) => console.log("SW registration failed:", err));
  });
}

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log("User response:", outcome);
  deferredPrompt = null;
  installBtn.style.display = "none";
});

window.addEventListener("appinstalled", () => {
  installBtn.style.display = "none";
  ok("برنامه نصب شد.");
});