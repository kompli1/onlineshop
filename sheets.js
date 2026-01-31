const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbxJGEOTYX-mt3ML4UpWaAkTiyOCfiR0er-QA2MeIE_v6GRV9Vf1UqiBm-_970_YJ7aE/exec";

function sendOrderToSheets(data) {
  console.log("📤 [Sheets] start sendOrderToSheets");
  console.log("📤 [Sheets] webhook:", SHEETS_WEBHOOK);
  console.log("📤 [Sheets] payload object:", data);

  try {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = SHEETS_WEBHOOK;
    form.target = "hidden_iframe";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "payload";
    input.value = JSON.stringify(data);

    console.log("📤 [Sheets] payload json:", input.value);

    form.appendChild(input);
    document.body.appendChild(form);

    console.log("📤 [Sheets] submitting form…");
    form.submit();

    console.log("✅ [Sheets] form submitted");

    setTimeout(() => {
      form.remove();
      console.log("🧹 [Sheets] form removed");
    }, 1000);

  } catch (err) {
    console.error("❌ [Sheets] send error:", err);
  }
}
