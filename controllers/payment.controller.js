const { v4: uuidv4 } = require("uuid");

exports.payment = (req, res) => {
  const { appointment, token } = req.body;
  const idempontencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      phone: token.phone,
      source: token.id,
    })
    .then(() => {
      stripe.charges.create(
        {
          amount: appointment.price * 100,
          currency: "eur",
          customer: customer.id,
          description: appointment.prestation,
          billing_details: {
            email: token.email,
            phone: token.phone,
          },
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
};
