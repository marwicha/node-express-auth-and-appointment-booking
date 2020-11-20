const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const dbConfig = require("./models");
const Role = dbConfig.role;

const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://marwa:mriwa654@auth-node.cpcsm.gcp.mongodb.net/ikdo?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


  function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }


var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// simple route
app.get("/", (req, res) => {
  res.json({ message: "IKDO application." });
});

// routes for auth user
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// routes for create appointnment and slots
require('./routes/appointment.routes')(app);
require('./routes/slot.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});