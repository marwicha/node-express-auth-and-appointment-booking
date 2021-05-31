const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cool = require("cool-ascii-faces");
const path = require("path");

const stripe = require("stripe")(
  "sk_test_51Iv0X0Idt2OtpHpwDaOcmr14pmEEn1WUxACanIIKsJlixvQv5PMt89DzxaqQQl2u32ADnVTCSKF3WU2lMH74e94m002SMRWsMz"
);

const app = express();

const dbConfig = require("./models");
const Role = dbConfig.role;

mongoose
  .connect(
    `mongodb+srv://marwa:mriwa654@auth-node.cpcsm.gcp.mongodb.net/ikdo?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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

// var corsOptions = {
//   origin: "http://localhost:3000",
// };
app.use(express.json());
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "IKDO project." });
});

app.get("/cool", (req, res) => res.send(cool()));

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

// set port, listen for requests
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
