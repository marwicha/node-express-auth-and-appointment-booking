const { v4: uuidv4 } = require("uuid");

const stripe = require("stripe")(
  "sk_test_51Iv0X0Idt2OtpHpwDaOcmr14pmEEn1WUxACanIIKsJlixvQv5PMt89DzxaqQQl2u32ADnVTCSKF3WU2lMH74e94m002SMRWsMz"
);

exports.payment = async (req, res) => {
  const { token } = req.body;
  const idempontencyKey = uuidv4();
  try {
    await stripe.customers.create({
      email: "marwa@gmail.com",
      phone: "25454",
      payment_method: "card",
      invoice_settings: {
        default_payment_method: "pm_card_visa",
      },
      preferred_locales: ["fr"],
    });

    const paymentIntent = stripe.paymentIntents.create(
      {
        amount: "1000",
        currency: "eur",
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
      },
      { idempontencyKey }
    );

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
};
