export async function getRates() {
  const BASE_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYmkwjHlwBNptKzeXwMimP3uAR6P-c8UuJnLt-5ZucPo2sEE921-re46ouye6b2A-uJUpEMm4TFJ2n/pub?output=csv";

  // 🔥 cache-buster to bypass Google CDN
  const url = `${BASE_URL}&_ts=${Date.now()}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Google Sheets error ${res.status}`);
  }

  const text = await res.text();
  const rows = text.trim().split("\n").slice(1);

  let BUY_RATE: number | null = null;
  let SELL_RATE: number | null = null;

  for (const row of rows) {
    const [key, value] = row.split(",");
    const num = Number(value);

    if (key === "BUY_RATE") BUY_RATE = num;
    if (key === "SELL_RATE") SELL_RATE = num;
  }

  if (
    BUY_RATE === null ||
    SELL_RATE === null ||
    isNaN(BUY_RATE) ||
    isNaN(SELL_RATE)
  ) {
    throw new Error("Invalid sheet data");
  }

  return {
    BUY_RATE,
    SELL_RATE,
    updatedAt: Date.now(),
  };
}
