export async function getRates(
  { forceRefresh = false }: { forceRefresh?: boolean } = {}
) {
  const BASE_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYmkwjHlwBNptKzeXwMimP3uAR6P-c8UuJnLt-5ZucPo2sEE921-re46ouye6b2A-uJUpEMm4TFJ2n/pub?output=csv";

  // 🔥 Cache buster (forces Google CDN refresh)
  const url = forceRefresh
    ? `${BASE_URL}&_ts=${Date.now()}`
    : BASE_URL;

  try {
    const res = await fetch(url, {
      cache: "no-store", // browser + edge cache bypass
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const text = await res.text();

    // Parse CSV
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

    return { BUY_RATE, SELL_RATE };
  } catch (error) {
    console.error("Failed to fetch rates:", error);
    throw new Error("Unable to fetch live rates. Please try again later.");
  }
}
