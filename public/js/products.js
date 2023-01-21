// OPEN MENU
function openMenu() {
    document.body.classList += " menu--open"
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}

let cartContentList = []
if (localStorage.getItem("cartList")) {
    var cartList = []
    var bigCartList = localStorage.getItem("cartList").split(',')

    for (let i = 0; i < bigCartList.length; i += 5) {
        var chunk = bigCartList.slice(i, i + 5);
        cartList.push(chunk)
    }

}
else {
    cartList = []
}

function cartStuff() {
    // CART MODAL ETC

    let cartIcon = document.querySelector('#cart-icon')
    let cart = document.querySelector('.cart-modal')
    let closeCart = document.querySelector('#close-cart')
    let cartPopupIcon = document.querySelector('.checkout__btn')

    let cartOpen = false

    cartIcon.onclick = () => {
        if (!cartOpen) {
            cart.classList.add('active')
            cartOpen = true
        }
        else {
            cart.classList.remove('active')
            cartOpen = false
        }
    }

    cartPopupIcon.onclick = () => {
        cart.classList.add('active')
        cartOpen = true
    }

    closeCart.onclick = () => {
        cart.classList.remove('active')
        cartOpen = false
    }

    //CART JS
    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', ready)
    } else {
        ready()
    }
}

//FUNCTION
function ready() {
    // LOCAL STORAGE FIND AND PLACE CART ITEMS
    for (i = 0; i < cartList.length; i++) {
        var cartShopBox = document.createElement('div')
        cartShopBox.classList.add('cart-box')
        var cartItems = document.getElementsByClassName('cart-content')[0]

        var cartBoxContent = `
        <img src="${cartList[i][4]}" alt="${cartList[i][0]}" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${cartList[i][0]}</div>
            <div class="cart-price" id="${cartList[i][2]}">${cartList[i][1]}</div>
            <input type="number" value="${cartList[i][3]}" class="cart-quantity">
        </div>
        <i class="bx bxs-trash-alt cart-remove"></i>`

        cartShopBox.innerHTML = cartBoxContent
        cartItems.append(cartShopBox)

        cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem)
        cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged)
        updatetotal()
    }

    // Remove Itmes from Cart
    var removeCartButtons = document.getElementsByClassName('cart-remove')
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    // QUANTITY
    var quantityInputs = document.getElementsByClassName('cart-quantity')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }
    var addCart = document.getElementsByClassName('add-cart')
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i]
        button.addEventListener('click', addCartClicked)
    }

    updatetotal()
}

function buyButtonClicked() {
    cartList = []
    localStorage.setItem("cartList", cartList)
    var modal = document.getElementById("myModal");
    let cart = document.querySelector('.cart-modal')
    const body = document.querySelector("body");

    cart.classList.remove('active')
    body.style.overflow = "hidden";
    modal.style.display = "block"

    var span = document.getElementById("close-modal")[0];
    span.onclick = function () {
        body.style.overflow = "auto";
        modal.style.display = "none"
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            body.style.overflow = "auto";
            modal.style.display = "none";
        }
    }
}

function removeCartItem(event) {
    var buttonClicked = event.target
    var parent = buttonClicked.parentElement
    var parentTitle = parent.getElementsByClassName('cart-product-title')[0].innerText
    parent.remove()

    for (i = 0; i < cartList.length; i++) {
        if (cartList[i][0] === parentTitle) {
            cartList.splice(i, 1)
        }
    }

    updatetotal();
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }

    let productDiv = input.parentElement.parentElement
    let productTitle = productDiv.getElementsByClassName('cart-product-title')[0].innerText
    let quantityElem = productDiv.getElementsByClassName('cart-quantity')[0]
    let quantityVal = quantityElem.value

    for (i = 0; i < cartList.length; i++) {
        if (cartList[i][0] === productTitle) {
            cartList[i][3] = parseInt(quantityVal)
        }
    }

    updatetotal()
}

function addCartClicked(event) {
    var button = event.target
    var shopProducts = button.parentElement
    var shopProductsImg = shopProducts.parentElement

    var title = shopProducts.getElementsByClassName('product--title')[0].innerText
    var price = shopProducts.getElementsByClassName('product--price')[0].innerText
    var priceSKU = shopProducts.getElementsByClassName('product--price')[0].id
    var productImg = shopProducts.getElementsByClassName('product--img')[0].src

    addProductToCart(title, price, productImg, priceSKU, button)
    updatetotal()
}

function addProductToCart(title, price, productImg, priceSKU, button) {
    var cartShopBox = document.createElement('div')
    cartShopBox.classList.add('cart-box')
    var cartItems = document.getElementsByClassName('cart-content')[0]
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title')
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            button.classList.remove('loading')
            alert('You have already added this item to cart.')
            return;
        }
    }

    var cartBoxContent = `
                            <img src="${productImg}" alt="${title}" class="cart-img">
                            <div class="detail-box">
                                <div class="cart-product-title">${title}</div>
                                <div class="cart-price" id="${priceSKU}">${price}</div>
                                <input type="number" value="1" class="cart-quantity">
                            </div>
                            <i class="bx bxs-trash-alt cart-remove"></i>`
    cartShopBox.innerHTML = cartBoxContent
    cartItems.append(cartShopBox)

    cartList.push([title, price, priceSKU, 1, productImg])

    cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem)
    cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged)

}

// UPDATE TOTAL
function updatetotal() {
    cartContentList = []
    var cartContent = document.getElementsByClassName('cart-content')[0]
    var cartBoxes = cartContent.getElementsByClassName('cart-box')
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i]
        var priceElement = cartBox.getElementsByClassName('cart-price')[0]
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0]
        var price = parseFloat(priceElement.innerText.replace('£', ""))
        var priceID = priceElement.id
        var quantity = quantityElement.value
        total = total + (price * quantity)
        cartContentList.push([priceID, quantity])
    }
    //PENCE
    total = Math.round(total * 100) / 100

    document.getElementsByClassName('total-price')[0].innerText = '£' + total

    var cartContentString = cartContentList.toString()
    var buyButtonElement = document.getElementsByClassName('buy-button')
    buyButtonElement.id = cartContentString

    var priceSkuElement = document.getElementById('price_skus')
    priceSkuElement.value = cartContentString

    localStorage.setItem("cartList", cartList)

    // CHECKOUT STUFF

    var cartPopup = document.getElementsByClassName('checkout__btn')[0]
    var buyButton = document.getElementsByClassName('checkout-button')[0]

    if (total > 0) {
        cartPopup.classList.add('checkout__btn--active')

        buyButton.innerText = "Checkout"
        buyButton.disabled = false;
        buyButton.classList.remove('checkout-button--notallowed')
    }
    else {
        cartPopup.classList.remove('checkout__btn--active')

        buyButton.disabled = true;
        buyButton.classList.add('checkout-button--notallowed')
    }
}

// PRODUCTS
let products;

async function renderProducts() {
    const productsWrapper = document.querySelector(".products--container");

    productsWrapper.classList += ' products__loading'

    if (!products) {
        products = await getProducts();
    }

    productsWrapper.classList.remove('products__loading')

    const productsHtml = products
        .map((product) => {
            return `<div class="product">
            <figure class="product--img__wrapper">
                <img src="${product.image}" alt="" class="product--img">
            </figure>
            <h2 class="product--title">${product.title}</h2>
            <h4 class="product--sub-title">${product.amount}g</h4>
            <h3 class="product--price" id="${product.SKU}">£${product.price.toFixed(2)}</h3>
            <button class="button product--btn add-cart">
                <p>Add to cart</p>
                <div class="cart">
                    <svg viewBox="0 0 36 26">
                        <polyline points="1 2.5 6 2.5 10 18.5 25.5 18.5 28.5 7.5 7.5 7.5"></polyline>
                        <polyline points="15 13.5 17 15.5 22 10.5"></polyline>
                    </svg>
                </div>
            </button>
        </div>`;
        })
        .join("");

    productsWrapper.innerHTML = productsHtml;

    // BUTTON 
    document.querySelectorAll('.button').forEach(button => button.addEventListener('click', e => {
        if (!button.classList.contains('loading')) {

            button.classList.add('loading');

            setTimeout(() => button.classList.remove('loading'), 3700);

        }
        e.preventDefault();
    }));
    cartStuff();
}

setTimeout(() => {
    renderProducts();
});

function getProducts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 0,
                    title: "Valentine's Duo",
                    amount: '2 x 100',
                    price: 3.50,
                    SKU: "price_1MSkn7ARYjIsWfAVHUENtOco",
                    image: "./assets/products/valentine-duo.png"
                },
                {
                    id: 1,
                    title: "Biscoff",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDtQARYjIsWfAVobLR3vzE",
                    image: "./assets/products/biscoff.png"
                },
                {
                    id: 2,
                    title: "Chocolate Orange",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDrlARYjIsWfAVg1QXbHJf",
                    image: "./assets/products/orange.png"
                },
                {
                    id: 3,
                    title: "Cookies and Cream",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDsuARYjIsWfAVQYyMppPa",
                    image: "./assets/products/oreo.png"
                },
                {
                    id: 4,
                    title: "Fruit & Nut",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDtHARYjIsWfAVAhjIwdL3",
                    image: "./assets/products/blank.png"
                },
                {
                    id: 5,
                    title: "Fujj Brownie",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDt6ARYjIsWfAV9GXcpkjS",
                    image: "./assets/products/blank.png"
                },
                {
                    id: 6,
                    title: "Honeycomb Crunch",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDs4ARYjIsWfAVbiwvo2P2",
                    image: "./assets/products/blank.png"
                },
                {
                    id: 7,
                    title: "Momentous Mars",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1Ld6s5ARYjIsWfAV1BvKOl7R",
                    image: "./assets/products/mars.png"
                },
                {
                    id: 8,
                    title: "Marvellous Mint",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDsHARYjIsWfAVciBQNXP2",
                    image: "./assets/products/blank.png"
                },
                {
                    id: 9,
                    title: "Milkyway",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDoBARYjIsWfAV72IQaLg2",
                    image: "./assets/products/milkyway.png"
                },
                {
                    id: 10,
                    title: "Mmm-Teasers",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDsfARYjIsWfAVZd0ai5V1",
                    image: "./assets/products/blank.png"
                },
                {
                    id: 11,
                    title: "Peanut Butter",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDrZARYjIsWfAVx99sCxk2",
                    image: "./assets/products/blank.png"
                },
                {
                    id: 12,
                    title: "Salted Caramel",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1Ld6sQARYjIsWfAVVHGqikNu",
                    image: "./assets/products/caramel.png"
                },
                {
                    id: 13,
                    title: "Snickers",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1LdDrOARYjIsWfAVHjD43uu8",
                    image: "./assets/products/blank.png"
                },
                {
                    id: 14,
                    title: "Unicorn Crunch",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1Ld6rdARYjIsWfAVf1ZTY8d7",
                    image: "./assets/products/m-m.png"
                },
                {
                    id: 15,
                    title: "Vegan Peanut Butter",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1MDQEoARYjIsWfAVZ8L90gzp",
                    image: "./assets/products/vegan-pb.png"
                },
                {
                    id: 16,
                    title: "Vegan Double Chocolate",
                    amount: 100,
                    price: 1.89,
                    SKU: "price_1MDQFKARYjIsWfAVVOg6oQTb",
                    image: "./assets/products/vegan-dc.png"
                },
            ]);
        }, 1000);
    });
}