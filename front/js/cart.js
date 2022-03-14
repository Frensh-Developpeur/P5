
window.onload = () => {
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

    } else {
        allFunction();
    }
}
function allFunction() {
    let productStorage = JSON.parse(localStorage.getItem("productStorage"));
    let totalItem = 0;
    let totalPrice = 0;
    let totalNumberItem = 0;
    const apiUrl = 'http://localhost:3000/api/products/';
    productStorage.forEach((product, i) => {
        fetch(apiUrl + product.id)
            .then(res => res.json())
            .then(productApi => {

                let a = document.createElement('article');
                a.className = 'cart__item';
                a.dataset.id = product.id;
                a.dataset.color = product.color;
                a.innerHTML =
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
                document.getElementById('cart__items').appendChild(a);
                totalNumberItem += productStorage[i].quantity;
                totalItem = productStorage[i].quantity;
                totalItem = totalItem * productApi.price;
                totalPrice += totalItem;
                document.querySelector('#totalQuantity').innerHTML = `${totalNumberItem}`;
                document.querySelector('#totalPrice').innerHTML = `${totalPrice}`;
            })
    })

    document.querySelector('#cart__items').addEventListener('change', function (e) {
        if (e.target.className === 'itemQuantity') {
            let modifQuantity = parseInt(e.target.value);
            let dataSetId = e.target.closest('.cart__item').dataset.id;
            let dataSetColor = e.target.closest('.cart__item').dataset.color;
            productStorage.forEach((product, i) => {
                fetch(apiUrl + product.id)
                    .then(res => res.json())
                    .then(productApi => {
                        if (product.id === dataSetId && product.color === dataSetColor) {
                            function modifPriceAndQuantityTotal() {
                                if (parseInt(e.target.value) === 0) {

                                    let totalQuantity = parseInt(document.querySelector('#totalQuantity').textContent);
                                    totalQuantity = totalQuantity - product.quantity;
                                    totalQuantity = totalQuantity + parseInt(e.target.value);
                                    totalQuantity++;
                                    document.querySelector('#totalQuantity').innerHTML = `${totalQuantity}`;

                                    let totalPrice = parseInt(document.querySelector('#totalPrice').textContent);
                                    let priceUnitConst = productApi.price * product.quantity;
                                    let priceUnitLet = productApi.price * parseInt(e.target.value);
                                    priceUnit = priceUnitLet - priceUnitConst;
                                    totalPrice = totalPrice + priceUnit;
                                    totalPrice = totalPrice + productApi.price;
                                    document.querySelector('#totalPrice').innerHTML = `${totalPrice}`;
                                } else {

                                    let totalQuantity = parseInt(document.querySelector('#totalQuantity').textContent);
                                    totalQuantity = totalQuantity - product.quantity;
                                    totalQuantity = totalQuantity + parseInt(e.target.value);
                                    document.querySelector('#totalQuantity').innerHTML = `${totalQuantity}`;

                                    let totalPrice = parseInt(document.querySelector('#totalPrice').textContent);
                                    let priceUnitConst = productApi.price * product.quantity;
                                    let priceUnitLet = productApi.price * parseInt(e.target.value);
                                    priceUnit = priceUnitLet - priceUnitConst;
                                    totalPrice = totalPrice + priceUnit;
                                    document.querySelector('#totalPrice').innerHTML = `${totalPrice}`;
                                }
                            }
                            if (e.target.value >= 1 && e.target.value <= 100) {
                                modifPriceAndQuantityTotal();
                                product.quantity = modifQuantity;
                                productStorage[i] = product;
                                localStorage.setItem('productStorage', JSON.stringify(productStorage))

                            } else {
                                modifPriceAndQuantityTotal();
                                if (!Number.isInteger(modifQuantity) || modifQuantity < 0) {
                                    alert('Erreur, un chiffre entier est attendu supérieur ou égal à 0')
                                    location.reload();
                                    return false;
                                }
                                if (confirm("Voulez vous supprimez l'article ?")) {

                                    let dataItem = e.target.closest('.cart__item');
                                    dataItem.remove();
                                    let tableProductFilter = productStorage.filter((item => item.id != dataSetId || item.color != dataSetColor));
                                    productStorage = tableProductFilter;
                                    localStorage.setItem('productStorage', JSON.stringify(productStorage));
                                    location.reload();
                                    if (localStorage.getItem('productStorage').length === 2) {
                                        localStorage.clear();
                                        location.reload();
                                    }
                                    return false;

                                } else {
                                    e.target.value = 1;
                                    product.quantity = parseInt(e.target.value);
                                    productStorage[i] = product;
                                    localStorage.setItem('productStorage', JSON.stringify(productStorage))
                                }
                            }
                        }
                    })
            })
        }
    })
    document.querySelector('#cart__items').addEventListener('click', function (e) {

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
    })
}
document.querySelector('#order').addEventListener('click', function (e) {
    checkForm();
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

        let updated = true;

        if (!allNameReg.test(firstName.value.trim())) {
            let msgErrorFirst = document.getElementById('firstNameErrorMsg').textContent = `Ce champ ne doit pas contenir de chiffre`;
            updated = false;
        } else {
            let msgErrorFirst = document.getElementById('firstNameErrorMsg').textContent = ``;
        }
        if (!allNameReg.test(lastName.value.trim())) {
            let msgErrorLast = document.getElementById('lastNameErrorMsg').textContent = `Ce champ ne doit pas contenir de chiffre`;
            updated = false;
        }
        else {
            let msgErrorLast = document.getElementById('lastNameErrorMsg').textContent = ``;
        }
        if (!addressReg.test(address.value.trim())) {
            let msgErrorAddress = document.getElementById('addressErrorMsg').textContent = `Vérifier qu'il n'y a aucune erreur !`;
            updated = false;
        } else {
            let msgErrorAddress = document.getElementById('addressErrorMsg').textContent = ``;
        }
        if (!cityReg.test(city.value.trim())) {
            let msgErrorCity = document.getElementById('cityErrorMsg').textContent = `Vérifier qu'il n'y a aucune erreur !`;
            updated = false;
        } else {
            let msgErrorCity = document.getElementById('cityErrorMsg').textContent = ``;
        }
        if (!emailReg.test(email.value.trim())) {
            let msgErrorEmail = document.getElementById('emailErrorMsg').textContent = `Vérifier que votre adresse ressemble bien à ce format : test@lok.fr!`;
            updated = false;
        } else {
            let msgErrorEmail = document.getElementById('emailErrorMsg').textContent = ``;
        }
        if (updated === true) {
            if (localStorage.getItem('productStorage')) {
                let contact = {
                    firstName: document.querySelector('#firstName').value,
                    lastName: document.querySelector('#lastName').value,
                    address: document.querySelector('#address').value,
                    city: document.querySelector('#city').value,
                    email: document.querySelector('#email').value
                }
                localStorage.setItem('contact', JSON.stringify(contact));
                let productStorage = JSON.parse(localStorage.getItem("productStorage"));
                let products = [];

                productStorage.forEach((product, i) => {
                    products.push(productStorage[i].id);

                })
                console.log(products)
                let contactProductsOrder = {
                    contact,
                    products
                }
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
                        window.location.href = `confirmation.html?orderId=${data.orderId}`;
                    })
                localStorage.clear();
            } else {
                let test = document.createElement('p');
                test.style.textAlign = 'center';
                test.style.fontSize = '2rem';
                test.textContent = `Le panier est vide`;
                document.querySelector('.cart__order__form').appendChild(test);
            }

        }
    }
}
)