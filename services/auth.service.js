const User = require("../models/userDetails.model");
const Token = require("../models/tokens.model");
const sendEmail = require("../utils/sendEmails");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const clientURL = process.env.CLIENT_URL;

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Email does not exist");

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

  const templates = {
    test: "d-369d35cfcc1c43e8966f24dfece375ae",
  };

  const msg = {
    from: "marwa.rekik.pro@gmail.com",
    subject: "changement mot de passe",
    templateId: templates.test,
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
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
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

  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.name,
    },
    "./template/resetPassword.handlebars"
  );

  await passwordResetToken.deleteOne();

  return true;
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};
