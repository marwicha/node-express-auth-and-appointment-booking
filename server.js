const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const dbConfig = require("./models");
const Role = dbConfig.role;

let DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(express.json());
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  const body = "This is a test email using SendGrid from Node.js";
  const msg = {
    to: "marwa.rekik.pro@gmail.com",
    from: "marwa.rekik.pro@gmail.com",
    subject: "Test email with Node.js and SendGrid",
    text: body,
    html: `<strong>${body}</strong>`,
  };

  sendGridMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
});

//res.json({ message: "IKDO project." });

// routes for auth user
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

// routes for admin
require("./routes/admin.routes")(app);
require("./routes/prestation.routes")(app);
require("./routes/formation.routes")(app);

// routes for create appointnment and slots
require("./routes/appointment.routes")(app);
require("./routes/slot.routes")(app);

// routes for payment
require("./routes/payment.routes")(app);

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
