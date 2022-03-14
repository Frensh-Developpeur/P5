window.onload = () => {

    fetch('http://localhost:3000/api/products')
        .then(function (res) {
            return res.json();
        })

        .then((productsItems) => {
            productsItems.forEach((item) => {
                let location = "./product.html?id=" + item._id;
                document.getElementById('items')
                    .innerHTML +=
                    ` <a href="${location}">
                 <article>
                    <img src="${item.imageUrl}" alt="${item.altTxt}" />
                    <h3 class="productName">${item.name}</h3>
                    <p class="productDescription">${item.description}</p>
                </article
                </a> `;
            }
            )
        })

        .catch(function () {
            document.querySelector('.titles').innerHTML = `<p id = "errorServeur" >Le serveur est actuellement indisponible</p>`;
            document.getElementById('errorServeur').style.textAlign = 'center';
            document.getElementById('errorServeur').style.fontSize = '2.5rem';
            document.getElementById('errorServeur').style.color = 'red';
            document.getElementById('errorServeur').style.fontWeight = 'bold'
            return false;
        })

}



