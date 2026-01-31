const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbwiB15DANjeqq0ojI9-nsFxvC3XEUou5FTw6G9L-myonlKw5muExw0wrVOaSIKN1Xga/exec";

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
