const User = require("../models/userDetails.model");
const Token = require("../models/tokens.model");
const sendEmail = require("../utils/sendEmails");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const clientURL = process.env.CLIENT_URL;

const templates = {
  resetPasswordRequest: "d-369d35cfcc1c43e8966f24dfece375ae",
  resetPassword: "d-34e7e6712a9840d0ba5e5c37d9d26df0",
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  //if (!user) throw new Error("Email does not exist");

  let token = await Token.findOne({ userId: user._id });

  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");

  const hash = await bcrypt.hash(resetToken, Number(10));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

  const msg = {
    from: "marwa.rekik.pro@gmail.com",
    templateId: templates.resetPasswordRequest,
    personalizations: [
      {
        to: [{ email: email }],
        dynamic_template_data: {
          link: link,
        },
      },
    ],
  };

  sendGridMail
    .send(msg)
    .then((res) => {
      console.log("Email sent");
      return res.status(201).send({
        message: "E-mail de réinitialisation de mot de passe envoyé!",
      });
    })
    .catch((error) => {
      if (!user) {
        return res.status(404).send({
          message: "Email n'existe pas",
        });
      }
    });
};

const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId });

  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  const hash = await bcrypt.hash(password, Number(10));

  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  const user = await User.findById({ _id: userId });

  // sendEmail(
  //   user.email,
  //   "Password Reset Successfully",
  //   {
  //     name: user.name,
  //   },
  //   "./template/resetPassword.handlebars"
  // );

  const msg = {
    from: "marwa.rekik.pro@gmail.com",
    templateId: templates.resetPassword,
    personalizations: [
      {
        to: [{ email: user.email }],
      },
    ],
  };

  sendGridMail
    .send(msg)
    .then(() => {
      console.log("Email for password change sent");
    })
    .catch((error) => {
      console.log(error);
    });

  await passwordResetToken.deleteOne();

  return true;
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};
