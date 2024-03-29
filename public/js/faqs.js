function openMenu() {
    document.body.classList += " menu--open"
}

function closeMenu() {
    document.body.classList.remove('menu--open')
}


// CART MODAL ETC

let cartIcon = document.querySelector('#cart-icon')
let cart = document.querySelector('.cart-modal')
let closeCart = document.querySelector('#close-cart')
let cartPopupIcon = document.querySelector('.checkout__btn')
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