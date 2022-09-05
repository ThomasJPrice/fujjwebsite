// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { response } = require('express');
const express = require('express');
var bodyParser = require('body-parser')
var app = express()
var os = require("os");

// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'));
const YOUR_DOMAIN = 'https://fujj.cyclic.app'
app.post('/create-checkout-session', async (req, res) => {

  var lineItems = []
  var totalQuantity = 0
  var discountAmount = 0
  var productPrices = req.body.product_sku
  var arr = productPrices.split(',')
  var discountArray = []
  var barsCoupon = null

  for (i = 0; i < arr.length; i++) {
    var first5 = arr[i].substring(0, 5)

    if (i % 2 == 0 && first5 === 'price') {

      lineItems.push(
        {
          price: `${arr[i]}`,
          quantity: `${arr[i + 1]}`
        },
      )

      totalQuantity = totalQuantity + parseInt(arr[i + 1])

    }
  }

  if (totalQuantity < 3) {
    discountAmount = 0
  }
  else if (totalQuantity % 3 == 0) {
    discountAmount = totalQuantity / 3
  }
  else if ((totalQuantity - 1) % 3 == 0) {
    discountAmount = (totalQuantity - 1) / 3
  }
  else if ((totalQuantity - 2) % 3 == 0) {
    discountAmount = (totalQuantity - 2) / 3
  }

  var discountCost = discountAmount * 67

  if (discountCost > 0) {
    const coupon = await stripe.coupons.create({ amount_off: discountCost, currency: "GBP", name: '3Barsfor5' });
    discountArray.push({
      coupon: `${coupon.id}`,
    })
    barsCoupon = coupon.id
  }

  const session = await stripe.checkout.sessions.create({
    submit_type: "pay",
    billing_address_collection: 'auto',
    payment_method_types: ['card'],
    shipping_address_collection: {
      allowed_countries: ['GB'],
    },
    shipping_options: [
      {
        shipping_rate: "shr_1Ld74VARYjIsWfAVXs3msYno",
      },
      {
        shipping_rate: "shr_1Ld74mARYjIsWfAVXiUPE5dP",
      },
    ],
    line_items: lineItems,
    mode: 'payment',
    discounts: discountArray,
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/index.html`,
  });

  res.redirect(303, session.url);
});


app.listen(4242, () => console.log(`Running at 4242`));