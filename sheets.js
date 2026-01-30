const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbyXX-AQuwsz8i0owIwBn3GfFeFJE-F5J0aYkq2EWIeQTaMDXNX4WHXnK6vVbjzCaZeL/exec";

async function sendOrderToSheets(data) {
  await fetch(SHEETS_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}
