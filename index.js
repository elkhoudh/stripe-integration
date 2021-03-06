require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const exphbs = require("express-handlebars");

const server = express();
server.use(express.urlencoded({ extended: false }));
server.engine("handlebars", exphbs({ defaultLayout: "main" }));
server.set("view engine", "handlebars");
server.use(express.static(`${__dirname}/public`));

server.get("/", (req, res) => {
  res.render("index");
});

server.post("/charge", (req, res) => {
  const { stripeToken, stripeEmail } = req.body;
  const amount = 2500;

  stripe.customers
    .create({
      email: stripeEmail,
      source: stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Test Product",
        currency: "usd",
        customer: customer.id
      })
    )
    .then(charge => res.json({ message: "Charge was successful" }))
    .catch(() => res.status(500).json({ message: "Stripe Error" }));
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log("Listening on port 5000"));
