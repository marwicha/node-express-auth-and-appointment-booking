const { v4: uuidv4 } = require("uuid");

const stripe = require("stripe")(
  "sk_test_51Iv0X0Idt2OtpHpwDaOcmr14pmEEn1WUxACanIIKsJlixvQv5PMt89DzxaqQQl2u32ADnVTCSKF3WU2lMH74e94m002SMRWsMz"
);

exports.payment = async (req, res) => {
  const { id } = req.body;
  const idempontencyKey = uuidv4();
  try {
    const paymentIntent = stripe.paymentIntents.create(
      {
        amount: "1000",
        currency: "eur",
        description: "Your Company Description",
        payment_method: id,
        confirm: true,
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

    res.json({
      message: "Payment Successful",
      success: true,
    });
  } catch (err) {
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
};
