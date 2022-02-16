let params = (new URL(window.location)).searchParams;
let id = params.get('id');

fetch('http://localhost:3000/api/products/' + id)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        console.log(value)
        let tableColors = [];
        tableColors = value.colors;
        document.querySelector('.item__img').innerHTML += `<img src="${value.imageUrl}" alt="${value.altTxt}">`
        document.getElementById('title').innerHTML = `${value.name}`
        document.getElementById('price').innerHTML = `${value.price}`
        document.getElementById('description').innerHTML = `${value.description}`

        for (i = 0; i < tableColors.length; i++) {
            document.getElementById('colors').innerHTML += `<option>${tableColors[i]}</option> `
        }
        let eventButton = document.getElementById('addToCart');

        eventButton.addEventListener('click', function () {
            let optionProduit = {
                id: value._id,
                name: value.name,
                priceUnit: value.price,
                quantiter: document.getElementById('quantity').value,
                colorItem: document.getElementById('colors').value
            }
            let productStorage = JSON.parse(localStorage.getItem("product"));

            if (optionProduit.quantiter <= 0 && optionProduit.quantiter === typeof (Number) || optionProduit.colorItem >= 0) {
                alert("Vous avez mal renseigner une valeur ! Veuillez choisir une couleur et ainsi que le nombre d'article souhaitée");
                return false;
            } else {

            }
            if (productStorage) {
                productStorage.push(optionProduit);
                localStorage.setItem("product", JSON.stringify(productStorage));
            }
            else {
                productStorage = [];
                productStorage.push(optionProduit)
                localStorage.setItem("product", JSON.stringify(productStorage));
            }

            console.log(productStorage);
        })



    })
    .catch(function (err) {
    })
