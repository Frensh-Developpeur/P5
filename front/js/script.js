fetch('http://localhost:3000/api/products')
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        for (i = 0; i < value.length; i++) {
            let valueId = value[i]._id;
            let location = "./product.html?id=" + valueId;
            document.getElementById('items')
                .innerHTML +=
                ` <a href="${location}">
                 <article>
                    <img src="${value[i].imageUrl}" alt="${value[i].altTxt}" />
                    <h3 class="productName">${value[i].name}</h3>
                    <p class="productDescription">${value[i].description}</p>
                </article
                </a> `
        }
    })
    .catch(function (err) {
    })
