
/* Charge le code une fois que le reste est chargée */
window.onload = () => {
    /* Vérifie que le localStorage est vide */
    if (localStorage.length === 0) {
        let panierNow = document.createElement('h2');
        panierNow.style.textAlign = "center";
        panierNow.style.fontSize = "2.5rem";
        panierNow.style.fontWeight = "bold";
        panierNow.style.color = "lightGreen";
        panierNow.textContent = 'Panier vide';
        document.querySelector('#cartAndFormContainer').prepend(panierNow);
        document.querySelector('h1').remove();
        document.querySelector('#totalQuantity').innerHTML = `0`;
        document.querySelector('#totalPrice').innerHTML = `0`;
        document.querySelector('#order').disabled = true;
        return false;
    }

    let productStorage = JSON.parse(localStorage.getItem("productStorage"));
    const apiUrl = 'http://localhost:3000/api/products/';
    allFunction(productStorage, apiUrl);

    /* Evenement qui gère la suppression des produits  */
    document.querySelector('#cart__items').addEventListener('click', function (e) {
        suppItem(e, productStorage, apiUrl);
    })

    /* Evenement qui gère la quantité des produits  */
    document.querySelector('#cart__items').addEventListener('change', function (e) {
        changeItem(e, productStorage, apiUrl);
    })
    /* Evenement qui gere le formulaire  */
    document.querySelector('#order').addEventListener('click', function (e) {
        e.preventDefault();
        if (checkForm() === false) {
            return false;
        }
        requestDom()
    });
}

/* Function affichant les produit contenu dans le localStorage*/
function allFunction(productStorage, apiUrl) {
    let totalPriceItem = 0;
    let totalPrice = 0;
    let totalNumberItem = 0;

    productStorage.forEach((product, i) => {
        fetch(apiUrl + product.id)
            .then(res => res.json())
            .then(productApi => {

                let articleCreate = document.createElement('article');
                articleCreate.className = 'cart__item';
                articleCreate.dataset.id = product.id;
                articleCreate.dataset.color = product.color;
                articleCreate.innerHTML =
                    `<div class="cart__item__img">
                        <img src="${productApi.imageUrl}" alt="${productApi.altTxt}"> 
                        </div>

                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${productApi.name}</h2>
                                <p>${product.color}</p>
                                <p>${productApi.price} €</p></div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete"> 
                                    <p class="deleteItem">Supprimer</p> 
                                    </div>
                                </div>
                            </div>`;
                document.getElementById('cart__items').appendChild(articleCreate);
                totalNumberItem += productStorage[i].quantity;
                totalPriceItem = productStorage[i].quantity * productApi.price;
                totalPrice += totalPriceItem;
                document.querySelector('#totalQuantity').innerHTML = `${totalNumberItem}`;
                document.querySelector('#totalPrice').innerHTML = `${totalPrice}`;
            });
    });
}
function changeItem(e, productStorage, apiUrl) {
    if (e.target.className === 'itemQuantity') {
        let modifQuantity = parseInt(e.target.value);
        let dataSetId = e.target.closest('.cart__item').dataset.id;
        let dataSetColor = e.target.closest('.cart__item').dataset.color;
        productStorage.forEach((product, i) => {
            fetch(apiUrl + product.id)
                .then(res => res.json())
                .then(productApi => {
                    if (product.id === dataSetId && product.color === dataSetColor) {
                        if (modifQuantity >= 1 && modifQuantity <= 100 && Number.isInteger(modifQuantity)) {

                            let totalQuantity = parseInt(document.querySelector('#totalQuantity').textContent);
                            totalQuantity = (totalQuantity - product.quantity) + parseInt(e.target.value);
                            document.querySelector('#totalQuantity').innerHTML = `${totalQuantity}`;

                            let totalPrice = parseInt(document.querySelector('#totalPrice').textContent);
                            let priceUnitConst = productApi.price * product.quantity;
                            let priceUnitLet = productApi.price * parseInt(e.target.value);
                            priceUnit = priceUnitLet - priceUnitConst;
                            totalPrice = totalPrice + priceUnit;
                            document.querySelector('#totalPrice').innerHTML = `${totalPrice}`;
                            product.quantity = modifQuantity;
                            productStorage[i] = product;
                            localStorage.setItem('productStorage', JSON.stringify(productStorage))

                        } else {

                            if (!Number.isInteger(modifQuantity) || modifQuantity < 0 || modifQuantity > 100) {
                                alert('Erreur, la valeur doit doit être supérieur à 0 et inférieur ou égal à 100');
                                e.target.value = product.quantity;
                                return false;
                            }

                            if (confirm("Voulez vous supprimez l'article ?")) {
                                let totalQuantity = parseInt(document.querySelector('#totalQuantity').textContent);
                                totalQuantity = (totalQuantity - product.quantity) + parseInt(e.target.value);
                                document.querySelector('#totalQuantity').innerHTML = `${totalQuantity}`;

                                let totalPrice = parseInt(document.querySelector('#totalPrice').textContent);
                                let priceUnitConst = productApi.price * product.quantity;
                                let priceUnitLet = productApi.price * parseInt(e.target.value);
                                priceUnit = priceUnitLet - priceUnitConst;
                                totalPrice = totalPrice + priceUnit;
                                document.querySelector('#totalPrice').innerHTML = `${totalPrice}`;
                                let dataItem = e.target.closest('.cart__item');
                                dataItem.remove();
                                let tableProductFilter = productStorage.filter((item => item.id != dataSetId || item.color != dataSetColor));
                                productStorage = tableProductFilter;
                                localStorage.setItem('productStorage', JSON.stringify(productStorage));

                                if (localStorage.getItem('productStorage').length === 2) {
                                    localStorage.clear();
                                    location.reload();
                                }
                            } else {
                                e.target.value = product.quantity;
                            }
                        }
                    }
                })
        })
    }
}
function suppItem(e, productStorage, apiUrl) {
    if (e.target.className === 'deleteItem') {
        let dataItem = e.target.closest('.cart__item');
        let dataSetId = e.target.closest('.cart__item').dataset.id;
        let dataSetColor = e.target.closest('.cart__item').dataset.color;

        productStorage.forEach((product, i) => {
            fetch(apiUrl + product.id)
                .then(res => res.json())
                .then(productApi => {

                    if (product.id === dataSetId && product.color === dataSetColor) {

                        let totalItemDom = parseInt(document.querySelector('#totalQuantity').textContent);
                        let totalQuantity = parseInt(totalItemDom - product.quantity);
                        document.querySelector('#totalQuantity').innerHTML = `${totalQuantity}`;

                        let totalPriceDom = parseInt(document.querySelector('#totalPrice').textContent);
                        let totalPriceJs = productApi.price * product.quantity;
                        let totalPrice = parseInt(totalPriceDom - totalPriceJs);
                        document.querySelector('#totalPrice').innerHTML = `${totalPrice}`;

                        dataItem.remove();
                        let tableProductFilter = productStorage.filter((item => item.id != dataSetId || item.color != dataSetColor));
                        productStorage = tableProductFilter;
                        localStorage.setItem('productStorage', JSON.stringify(productStorage));

                        if (localStorage.getItem('productStorage').length === 2) {
                            localStorage.clear();
                            location.reload();
                        }
                    }
                })
        })
    }
}

function checkForm() {
    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let address = document.getElementById('address');
    let city = document.getElementById('city');
    let email = document.getElementById('email');

    const allNameReg = new RegExp(`^[a-zA-Zàâäéèêëïîôöùûüç° -]{1,}$`);
    const addressReg = new RegExp(`^[a-zA-Zàâäéèêëïîôöùûüç°0-9 -]{1,}$`);
    const cityReg = new RegExp(`^[a-zA-Zàâäéèêëïîôöùûüç° -]{1,}$`);
    const emailReg = new RegExp(`^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$`, `g`);

    let msgErrorFirst = (!allNameReg.test(firstName.value.trim())) ? `Ce champ ne doit pas contenir de chiffre` : ``;
    document.getElementById('firstNameErrorMsg').textContent = msgErrorFirst;

    let msgErrorLast = (!allNameReg.test(lastName.value.trim())) ? `Ce champ ne doit pas contenir de chiffre` : ``;
    document.getElementById('lastNameErrorMsg').textContent = msgErrorLast;

    let msgErrorAddress = (!addressReg.test(address.value.trim())) ? `Vérifier qu'il n'y a aucune erreur !` : ``;
    document.getElementById('addressErrorMsg').textContent = msgErrorAddress;

    let msgErrorCity = (!cityReg.test(city.value.trim())) ? `Vérifier qu'il n'y a aucune erreur !` : ``;
    document.getElementById('cityErrorMsg').textContent = msgErrorCity;

    let msgErrorEmail = (!emailReg.test(email.value.trim())) ? `Vérifier que votre adresse ressemble bien à ce format : exemple@domaine.com` : ``;
    document.getElementById('emailErrorMsg').textContent = msgErrorEmail;


    if (msgErrorLast || msgErrorFirst || msgErrorAddress || msgErrorCity || msgErrorEmail) {
        return false;
    }
    //

}

function requestDom() {
    let contact = {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        address: document.querySelector('#address').value,
        city: document.querySelector('#city').value,
        email: document.querySelector('#email').value
    }
    let productStorage = JSON.parse(localStorage.getItem("productStorage"));
    let products = [];

    productStorage.forEach((product) => {
        products.push(product.id);
    });

    let contactProductsOrder = {
        contact,
        products
    };
    serverResp(contactProductsOrder);
}

function serverResp(contactProductsOrder) {
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(contactProductsOrder),
    })
        .then(res => res.json())
        .then(data => {
            localStorage.clear();
            window.location.href = `confirmation.html?orderId=${data.orderId}`;
        });
}


