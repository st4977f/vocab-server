const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
global.Vocab = require("./api/models/vocabModel");
const routes = require("./api/routes/vocabRoutes");
require("dotenv").config();

mongoose.Promise = global.Promise;

mongoose.set("debug", true); // Enable Mongoose debug mode for detailed logging

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

const port = process.env.PORT || 3000;
const app = express();

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(",");

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});
