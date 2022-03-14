/* Permet de récuperer l'id indiquer dans l'url pour s'adapter à chaque produit */
let params = (new URL(window.location)).searchParams;
let id = params.get('id');
/* Fin */

/* Connexion avec l'API récupération de la promesses */
fetch('http://localhost:3000/api/products/' + id)
    .then(function (res) {
        return res.json();
    })
    /* Fin */

    /* Utilisation du contenu fournit par l'api avec ajout dans le DOM */
    .then(function (value) {
        // console.log(value)

        let tableColors = value.colors;

        /* Img crée et à ajouter au contenu */
        let image = document.createElement('img');
        image.src = value.imageUrl;
        image.alt = value.altTxt;
        document.querySelector('.item__img').appendChild(image);

        /* Valeur ajoutée aux élements déja crée sur l'HTML */
        document.getElementById('title').innerHTML = `${value.name}`;
        document.getElementById('price').innerHTML = `${value.price}`;
        document.getElementById('description').innerHTML = `${value.description}`;

        /* Utilisation d'une boucle permettant de génerer des options(couleurs) */
        for (i = 0; i < tableColors.length; i++) {
            document.getElementById('colors').innerHTML += `<option value="${tableColors[i]}">${tableColors[i]}</option> `;
        }
        /* Fin */

        /* Ajout d'un event qui récupère les données rentrée par l'utilisateur */
        let eventButton = document.getElementById('addToCart');

        eventButton.addEventListener('click', function () {
            /* Fin de l'event */
            let optionProduit = {
                id: value._id,
                altTxt: value.altTxt,
                imgUrl: value.imageUrl,
                name: value.name,
                priceUnit: value.price,
                quantity: parseInt(document.getElementById('quantity').value),
                colorItem: document.getElementById('colors').value
            }

            /* Gestion de la sécurité des potentiels failles */
            if (optionProduit.colorItem === "") {
                alert('Veuillez renseignez une couleur pour chaque produit');
                return false;
            } else {
                console.log(true)
            }
            if (Number.isInteger(optionProduit.quantity) == true || optionProduit.quantity == Number) {
                console.log(true)
            } else {
                alert('Il faut renseignez un chiffre ou un nombre dans la partie quantiter')
                return false;
            }
            if (optionProduit.quantity <= 0 || optionProduit.quantity > 100) {
                alert('Veuillez renseignez une valuer supérieur à 0 et inférieur à 101 pour chaque produit');
                return false;
            } else {
                console.log(true)
            }
            /* Fin des vérification */

            /* Ajout des élements dans le local Storage sous conditions */

            let productStorage = JSON.parse(localStorage.getItem("product"));
            if (productStorage === null || productStorage.length === 0) {
                productStorage = [];
            }



            if (localStorage.getItem('basket')) {
                basket = JSON.parse(localStorage.getItem('basket'));
                basket.forEach((product, i) => {
                    if (product.id === detailProduct.id && product.color === detailProduct.color) {
                        product.quantity += detailProduct.quantity;
                        basket[i] = product;
                        localStorage.setItem('basket', JSON.stringify(basket));
                        updated = true;
                        addConfirm();
                        return true;
                    }
                });

                productStorage.push(optionProduit);
                localStorage.setItem("product", JSON.stringify(productStorage));





                /*Fin de l'ajout des élements dans le local Storage */
                console.log(productStorage[0].id);
            })


        /* Si l'API n'est pas reconnu le catch ce déclenche et met fin au script */
    })
    .catch(function (err) {
        alert('Serveur indisponible, veuillez réessayer plus tard');
    })
