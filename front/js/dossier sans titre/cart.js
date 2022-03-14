fetch('http://localhost:3000/api/products')
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {

        let productStorage = JSON.parse(localStorage.getItem("product"));
        for (i = 0; i < productStorage.length; i++) {
            document.getElementById('cart__items')
                .innerHTML += `<article class="cart__item" data-id="${productStorage[i].id}" data-color="${productStorage[i].colorItem}">
            <div class="cart__item__img"><img src="${productStorage[i].imgUrl}"alt="${productStorage[i].altTxt}"></div >
            <div class="cart__item__content" >
            <div class="cart__item__content__description">
                <h2>${productStorage[i].name}</h2 >
                <p>${productStorage[i].colorItem}</p>
                <p>${productStorage[i].priceUnit}</p>
            </div >
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté :</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productStorage[i].quantity}">
                    </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
              </article >`

        }
    })


    .catch(function (err) {
        alert("Veuillez réessayer plus tard")
    })