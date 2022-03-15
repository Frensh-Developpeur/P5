/* Permet de récuperer l'id indiquer dans l'url pour afficher le numéro de commande */
let params = (new URL(window.location)).searchParams;
let id = params.get('orderId');

/* Affiche le numéro de commande dans le DOM */
document.querySelector('#orderId').textContent = `${id}`;