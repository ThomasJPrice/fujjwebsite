// This is your test secret API key.
const stripe = require('stripe')('sk_test_51KaOEvARYjIsWfAVtTHpoPYOkAI8jojTDYH3pbJb0Tot0i8DkoTW4GhJHPC0Bql0aimMkQUvbocGo508mV6AvUnl00UuCWY05e');
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
  var productPrices = req.body.product_sku
  var arr = productPrices.split(',')

  for (i = 0; i < arr.length; i++) {
    if (i % 2 == 0) {

      lineItems.push(
        {
          price: `${arr[i]}`,
          quantity: `${arr[i + 1]}`
        },
      )
    }
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
        shipping_rate: "shr_1LV8PMARYjIsWfAVqLfR10wB",
      },
      {
        shipping_rate: "shr_1LV8OvARYjIsWfAVbfxNScX1",
      },
    ],
    line_items: lineItems,
    mode: 'payment',
    allow_promotion_codes: true,
    // discounts: [{
    //   coupon: 'CVyZruQp',
    // }],
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/index.html`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log(`Running at 4242`));