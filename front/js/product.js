/* Permet de récuperer l'id indiquer dans l'url pour s'adapter à chaque produit */
let params = (new URL(window.location)).searchParams;
let id = params.get('id');
/* Fin */

window.onload = () => {
    /* Connexion avec l'API récupération de la promesses */
    fetch('http://localhost:3000/api/products/' + id)
        .then(function (res) {
            return res.json();
        })
        /* Fin */

        /* Utilisation du contenu fournit par l'api avec ajout dans le DOM */
        .then(function (item) {
            /* Vérification de la réponse de l'API. Si produit manquant dans l'API affiche le code contenu dans (Else) */
            if (item.imageUrl && item.altTxt) {
                let image = document.createElement('img');
                image.src = item.imageUrl;
                image.alt = item.altTxt;
                document.querySelector('.item__img').appendChild(image);
            } else {
                document.querySelector('.item__img').innerHTML = `Image d'un canapé`;
            }

            if (item.name) {
                document.querySelector('title').innerHTML = `${item.name}`;
                document.getElementById('title').innerHTML = `${item.name}`;
            } else {
                document.querySelector('title').innerHTML = `Produit non défini`;
                document.getElementById('title').innerHTML = `Produit non défini`;
                document.getElementById('addToCart').disabled = true;
            }

            if (item.price) {
                document.getElementById('price').innerHTML = `${item.price}`;
            } else {
                document.getElementById('price').innerHTML = `0 `;
                document.getElementById('addToCart').disabled = true;
            }

            if (item.description) {
                document.getElementById('description').innerHTML = `${item.description}`;
            } else {
                document.getElementById('description').innerHTML = `La description n'est pas disponible.`;
            }

            /* Utilisation d'une boucle permettant de génerer des options(couleurs) */
            if (item.colors) {
                let tableColors = item.colors;
                tableColors.forEach((colorProduct, i) => {
                    colorProduct = document.getElementById('colors').innerHTML += `<option value="${tableColors[i]}">${tableColors[i]}</option> `;
                })
            } else {
                document.getElementById('colors').innerHTML += `<option value="Non disponible à l'achat">Non disponible à l'achat</option> `;
                document.getElementById('addToCart').disabled = true;
            }

            /* Fin */

            /* Ajout d'un event qui récupère les données rentrée par l'utilisateur */
            let eventButton = document.getElementById('addToCart');

            eventButton.addEventListener('click', function () {
                /* Fin de l'event */
                let productStorage = [];
                let updateConfirm = false;
                let quantity = document.querySelector('#quantity').value;

                let optionProduit = {
                    id: id,
                    quantity: parseInt(quantity),
                    color: document.getElementById('colors').value
                }
                /* Function qui se base en rapport à la gestion de la sécurité */
                function alertConf() {
                    let buttonDisabled = document.querySelector('#addToCart');
                    buttonDisabled.disabled = true;
                    document.getElementById("addToCart").style.backgroundColor = 'white';

                    if (optionProduit.color === "" || !Number.isInteger(optionProduit.quantity) || optionProduit.quantity <= 0 || optionProduit.quantity > 100) {
                        document.getElementById("errorKanap").style.fontWeight = 'bold';
                        document.getElementById('errorKanap').style.color = 'red';
                        setTimeout(function () {
                            location.reload();
                        }, 2000)
                    }
                    else {
                        document.getElementById("confirmKanap").style.fontWeight = 'bold';
                        document.getElementById("confirmKanap").style.color = 'green';
                        if (confirm("Voulez-vous être renvoyé au panier ? L'option Annuler vous permet d'ajouter la commande au panier tout en restant sur cette page !")) {
                            setTimeout(function () {
                                window.location.href = `cart.html`;
                            }, 1000)

                        } else {
                            setTimeout(function () {
                                location.reload();
                            }, 2000)
                        }

                    }

                }
                /* Gestion de la sécurité des potentiels failles */
                if (optionProduit.color === "") {
                    let test = document.querySelector('#addToCart').innerHTML = `<p id = errorKanap >Veuillez renseignez une couleur</p>`;
                    alertConf();
                    return false;
                }
                else if (!Number.isInteger(optionProduit.quantity)) {
                    let test = document.querySelector('#addToCart').innerHTML = `<p id = errorKanap >Il faut renseignez un chiffre ou un nombre dans la partie quantiter</p>`;
                    alertConf();
                    return false;
                }
                else if (optionProduit.quantity <= 0 || optionProduit.quantity > 100) {
                    document.querySelector('#addToCart').innerHTML = `<p id = errorKanap >Veuillez renseignez une valuer supérieur à 0 et inférieur ou égal à 100 pour chaque produit</p>`;
                    document.getElementById('errorKanap').style.color = 'red';
                    alertConf();
                    return false;

                }
                else {
                    document.querySelector('#addToCart').innerHTML = `<p id = confirmKanap >La commande à été ajouté au panier !</p>`;
                    alertConf();
                }
                /* Fin des vérification */

                /* Ajout des élements dans le local Storage sous conditions */
                if (localStorage.getItem('productStorage')) {
                    productStorage = JSON.parse(localStorage.getItem('productStorage'));
                    productStorage.forEach((product, i) => {
                        if (product.id === optionProduit.id && product.color === optionProduit.color) {
                            product.quantity += optionProduit.quantity;
                            productStorage[i] = product;
                            localStorage.setItem('productStorage', JSON.stringify(productStorage));
                            updateConfirm = true;
                            return true;
                        }
                    });
                }
                if (!updateConfirm) {
                    productStorage.push(optionProduit);
                    localStorage.setItem('productStorage', JSON.stringify(productStorage));
                }
                /*Fin de l'ajout des élements dans le local Storage */
            })
        })
        /* Si l'API n'est pas reconnu le catch ce déclenche et met fin au script */
        .catch(function () {
            document.querySelector('.item').innerHTML = `<p id = "errorServeur" >Le serveur est actuellement indisponible</p>`;
            document.getElementById('errorServeur').style.fontSize = '2.5rem';
            document.getElementById('errorServeur').style.color = 'red';
            document.getElementById('errorServeur').style.fontWeight = 'bold'
            return false;
        })
}
