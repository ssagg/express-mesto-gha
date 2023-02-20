const express = require("express");
const usersRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

const usermdlw = (req, res, next) => {
  req.user = {
    _id: "63f1ea7dc5015ff0f32d19a1",
  };
  next();
};
app.use(usermdlw);

app.use("/users", usersRouter);
app.use("/users/me", usersRouter);
app.use("/users/me/avatar", usersRouter);
app.use("/users/:userId", usersRouter);

app.use("/cards", cardRouter);
app.use("/cards/:cardId", cardRouter);
app.use("/cards/:cardId/likes", cardRouter);

app.listen(PORT, () => {
  console.log(`App port:${PORT}`);
});
