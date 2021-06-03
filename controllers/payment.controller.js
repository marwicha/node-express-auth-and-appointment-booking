const { v4: uuidv4 } = require("uuid");

const stripe = require("stripe")(
  "sk_test_51Iv0X0Idt2OtpHpwDaOcmr14pmEEn1WUxACanIIKsJlixvQv5PMt89DzxaqQQl2u32ADnVTCSKF3WU2lMH74e94m002SMRWsMz"
);

exports.payment = async (req, res) => {
  const { token } = req.body;

  try {
    stripe.customers
      .create({
        email: token.email,
        source: token.id,
      })
      .then((customer) => {
        stripe.charges.create({
          id: customer.id,
          amount: "1000",
          currency: "eur",
          description: "Your Company Description",
        });
      })
      .then((result) => res.status(200).send(result));

    //customer: customer.id,
    //description: "okkkkk",
    // billing_details: {
    //   email: token.email,
    //   phone: token.phone,
    // },
    // shipping: {
    //   name: token.card.name,
    //   address: {
    //     country: token.card.address_country,
    //   },
    // },
  } catch (err) {
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
};
