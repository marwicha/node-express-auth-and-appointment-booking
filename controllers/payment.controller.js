const { v4: uuidv4 } = require("uuid");

const stripe = require("stripe")(
  "sk_test_51Iv0X0Idt2OtpHpwDaOcmr14pmEEn1WUxACanIIKsJlixvQv5PMt89DzxaqQQl2u32ADnVTCSKF3WU2lMH74e94m002SMRWsMz"
);

exports.payment = async (req, res) => {
  const { paymentMethodType, currency } = req.body;

  const params = {
    payment_method_types: [paymentMethodType],
    currency: currency,
    amount: 2222,
  };

  try {
    const paymentIntent = await stripe.paymentIntents.create(params);

    //   {
    //     amount: "1000",
    //     currency: "eur",
    //     //customer: customer.id,
    //     //description: "okkkkk",
    //     // billing_details: {
    //     //   email: token.email,
    //     //   phone: token.phone,
    //     // },
    //     // shipping: {
    //     //   name: token.card.name,
    //     //   address: {
    //     //     country: token.card.address_country,
    //     //   },
    //     // },
    //   },

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};
