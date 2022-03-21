window.onload = () => {

    /* Permet de récuperer l'id indiquer dans l'url pour s'adapter à chaque produit */
    let params = (new URL(window.location)).searchParams;
    let id = params.get('id');
    /* Fin */
    /* Connexion avec l'API récupération de la promesses */
    fetch('http://localhost:3000/api/products/' + id)
        .then(function (res) {
            return res.json();
        })
        /* Utilisation du contenu fourni par l'api avec ajout dans le DOM */
        .then(function (item) {
            /* Vérification de la réponse de l'API. Si un produit manquant dans l'API affiche le code contenu dans (Else) */
            if (item.imageUrl && item.altTxt) {
                let image = document.createElement('img');
                image.src = item.imageUrl;
                image.alt = item.altTxt;
                document.querySelector('.item__img').appendChild(image);
            } else {
                document.querySelector('.item__img').innerHTML = `Image canapé`;
            }

            if (item.name) {
                document.querySelector('title').innerHTML = `${item.name}`;
                document.getElementById('title').innerHTML = `${item.name}`;
            } else {
                document.querySelector('title').innerHTML = `Nom du produit non défini`;
                document.getElementById('title').innerHTML = `Nom du produit non défini`;
            }

            if (item.price) {
                document.getElementById('price').innerHTML = `${item.price} `;
            } else {
                document.getElementById('price').innerHTML = `- `;
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
                tableColors.forEach((colorProduct) => {
                    document.getElementById('colors').innerHTML += `<option value="${colorProduct}">${colorProduct}</option> `;
                });
            } else {
                document.getElementById('colors').innerHTML = `<option>Non disponible à l'achat</option> `;
                document.getElementById('addToCart').disabled = true;
            }

            /* Fin */

            /* Ajout d'un event qui récupère les données rentrée par l'utilisateur */
            let eventButton = document.getElementById('addToCart');

            eventButton.addEventListener('click', function () {
                /* Fin de l'event */
                let productStorage = [];
                let updateConfirm = false;
                let quantity = parseInt(document.querySelector('#quantity').value);

                let optionProduit = {
                    id: id,
                    quantity: quantity,
                    color: document.getElementById('colors').value
                }
                /* Function qui se base en rapport à la gestion de la sécurité */
                function alertConf() {

                    if (optionProduit.color === "" || !Number.isInteger(optionProduit.quantity) || optionProduit.quantity <= 0 || optionProduit.quantity > 100) {
                        let errorKanap = document.createElement('h3');
                        errorKanap.setAttribute('id', 'errorKanap');
                        errorKanap.style.textAlign = 'center';
                        document.querySelector('.item__content').appendChild(errorKanap);
                        document.getElementById("errorKanap").style.fontWeight = 'bold';
                        document.getElementById('errorKanap').style.color = 'red';
                        setTimeout(function () {
                            errorKanap.remove();
                        }, 4000);
                    }
                    else {
                        let confirmKanap = document.createElement('h2');
                        confirmKanap.setAttribute('id', 'confirmKanap');
                        confirmKanap.style.textAlign = 'center';
                        document.querySelector('.item__content').appendChild(confirmKanap);
                        document.getElementById("confirmKanap").style.fontWeight = 'bold';
                        document.getElementById("confirmKanap").style.color = 'lightGreen';
                        setTimeout(function () {
                            confirmKanap.remove();
                        }, 2000);
                    }

                }
                /* Gestion de la sécurité des potentiels failles */
                if (optionProduit.color === "") {
                    alertConf();
                    errorKanap.textContent = 'Veuillez renseignez une couleur';
                    return false;
                }
                else if (!Number.isInteger(optionProduit.quantity)) {
                    alertConf();
                    errorKanap.textContent = 'Il faut renseignez un chiffre ou un nombre dans la partie quantiter';
                    return false;
                }
                else if (optionProduit.quantity <= 0 || optionProduit.quantity > 100) {
                    alertConf();
                    errorKanap.textContent = 'Veuillez renseignez une valeur supérieur à 0 et inférieur ou égal à 100 pour chaque produit';
                    return false;
                }
                if (true) {
                    alertConf();
                    confirmKanap.textContent = 'Article ajouté au panier';
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
