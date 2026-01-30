const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbykfJON5DSDXcgAedxk1OOcDtDliouNBwFfYQedQVqKDDJC3LGuZs5BW1D7DTlNUK3g/exec";

async function sendOrderToSheets(data) {
  await fetch(SHEETS_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}
