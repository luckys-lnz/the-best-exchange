export async function getRates() {
  const DOC_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYmkwjHlwBNptKzeXwMimP3uAR6P-c8UuJnLt-5ZucPo2sEE921-re46ouye6b2A-uJUpEMm4TFJ2n/pub?output=csv";

  try {
    const res = await fetch(DOC_URL, {
      // Use ISR so pages can be prerendered at build time and revalidated.
      // Revalidate every 60 seconds to keep rates reasonably fresh.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const text = await res.text();

    // Split CSV
    const rows = text.trim().split("\n").slice(1); // remove header row

    let BUY_RATE: number | null = null;
    let SELL_RATE: number | null = null;

    for (const row of rows) {
      const [key, value] = row.split(",");
      const num = Number(value);

      if (key === "BUY_RATE") BUY_RATE = num;
      if (key === "SELL_RATE") SELL_RATE = num;
    }

    if (BUY_RATE === null || SELL_RATE === null) {
      throw new Error("Missing BUY_RATE or SELL_RATE in sheet");
    }

    if (isNaN(BUY_RATE) || isNaN(SELL_RATE)) {
      throw new Error("Rates are not valid numbers");
    }

    return { BUY_RATE, SELL_RATE };
  } catch (error) {
    console.error("Failed to fetch rates from Google Sheets:", error);
    throw new Error("Unable to fetch live rates. Please try again later.");
  }
}
