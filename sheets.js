const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbyXX-AQuwsz8i0owIwBn3GfFeFJE-F5J0aYkq2EWIeQTaMDXNX4WHXnK6vVbjzCaZeL/exec";

function sendOrderToSheets(data) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = SHEETS_WEBHOOK;
  form.target = "hidden_iframe";

  const input = document.createElement("input");
  input.name = "payload";
  input.value = JSON.stringify(data);

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  form.remove();
}
