

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
        console.log(tableColors)

        document.querySelector('.item__img').innerHTML += `<img src="${value.imageUrl}" alt="${value.altTxt}">`
        document.getElementById('title').innerHTML = `${value.name}`
        document.getElementById('price').innerHTML = `${value.price}`
        document.getElementById('description').innerHTML = `${value.description}`

        for (i = 0; i < tableColors.length; i++) {
            document.getElementById('colors').innerHTML += `<option>${tableColors[i]}</option> `
        }

    })
    .catch(function (err) {
    })