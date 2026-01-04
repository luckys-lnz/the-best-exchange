export async function getRates() {
  const DOC_URL =
    "https://docs.google.com/document/d/e/2PACX-1vT5vJkS26lFaw6LeONnKi2SH2d9JsuirTR97Z2wm6X_9gtpXRq85P0FpxnqkrqxLZbjFmOdgl9uJ_ZM/pub";

  try {
    const res = await fetch(DOC_URL);
    if (!res.ok) throw new Error("Failed to fetch rates from Google Doc");

    const text = await res.text();
    const json = JSON.parse(text); // direct JSON parsing

    // Validate and parse numbers
    const BUY_RATE = Number(json.BUY_RATE);
    const SELL_RATE = Number(json.SELL_RATE);

    if (!BUY_RATE || !SELL_RATE) throw new Error("Invalid rates in document");

    return { BUY_RATE, SELL_RATE };
  } catch (e) {
    console.error("Failed to fetch rates from Google Doc:", e);
    // IMPORTANT: Remove defaults if you don’t want fallback
    throw new Error("Unable to fetch live rates. Please try again later.");
  }
}
