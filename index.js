const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/test", (req, res) => {
  res.send({ result: 0 });
});

app.get("/validate", (req, res) => {
  const { partNo } = req.query;
  if (partNo) {
    return db.executeStatement(partNo, res);
  }

  //  res.send(req.query);
});

const port = process.env.PORT || 80;

app.listen(port, () => console.log(`Server running on port ${port}`));
