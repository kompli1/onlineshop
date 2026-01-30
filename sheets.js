const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbzPzqu2vRcey_4IiQZYfuj30NjWt5rAJnyMxqhVA2fCF52ap01a2eMsrPjJJmPP574b/exec";



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
