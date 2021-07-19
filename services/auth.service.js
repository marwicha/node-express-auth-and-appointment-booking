const User = require("../models/userDetails.model");
const Token = require("../models/tokens.model");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
// React js app front
const clientURL = process.env.CLIENT_URL;

//Templates from sendGrid account
const templates = {
  resetPasswordRequest: "d-369d35cfcc1c43e8966f24dfece375ae",
  resetPassword: "d-d0b9460bc12643b991d9c1841fbd19ab",
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  let token = await Token.findOne({ userId: user._id });

  if (token) await token.deleteOne();

  let resetToken = crypto.randomBytes(32).toString("hex");

  const hash = await bcrypt.hash(resetToken, Number(10));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  if (!user) {
    return res.status(404).send({ message: "cet email n'existe pas." });
  }

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

  const emailPatrick = "ikdo.zen@gmail.com";

  const msgRequestPasswordReset = {
    from: `Equipe IKDO <${emailPatrick}>`,
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
    .send(msgRequestPasswordReset)
    .then((res) => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.log(error);
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
  const emailPatrick = "ikdo.zen@gmail.com";

  const msgResetPassword = {
    from: `Equipe IKDO <${emailPatrick}>`,
    templateId: templates.resetPassword,
    personalizations: [
      {
        to: [{ email: user.email }],
      },
    ],
  };

  sendGridMail
    .send(msgResetPassword)
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
