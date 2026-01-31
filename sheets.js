const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbyf0sMobvzsNuxcQnlET1RSYgFaYNfRG_2oXa4pLAE36L5laAITW2vNmEcAPu8a74Az/exec";

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
