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

app.post("/validateparts", async (req, res) => {
  const { partNumbers } = req.body.payload;
  console.log(partNumbers);
  let parsedPartNumbers = JSON.parse(partNumbers);

  let result = [];
  for (let i = 0; i < parsedPartNumbers.length; i++) {
    let resultData = await db.getPartPromise(parsedPartNumbers[i]);
    //console.log(resultData);
    result.push(resultData);
    // resultData.length === 1 && resultData.length > 0
    //   ? result.push(resultData[0])
    //   : result.push(resultData);
  }
  res.send({ result });
});

const port = process.env.PORT || 80;

app.listen(port, () => console.log(`Server running on port ${port}`));
