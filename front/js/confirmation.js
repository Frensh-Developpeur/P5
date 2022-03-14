let params = (new URL(window.location)).searchParams;
let id = params.get('orderId');

document.querySelector('#orderId').textContent = `${id}`;