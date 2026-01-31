const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbzRdIf3JM-BQ8Wy3t_0MEfpi7xwZ1eCTwhHMFDZjI5TGXvfvaNxPE6QpeJLZdT5t1ME/exec";

function sendOrderToSheets(data) {
  console.log("📤 Sending to Sheets:", data);

  fetch(SHEETS_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      payload: JSON.stringify(data)
    })
  })
  .then(r => r.text())
  .then(t => console.log("✅ Sheets response:", t))
  .catch(e => console.log("❌ Sheets error:", e));
}
