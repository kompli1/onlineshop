const SHEETS_WEBHOOK = "ВСТАВЬ_URL_СЮДА";

async function sendOrderToSheets(data) {
  await fetch(SHEETS_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}
