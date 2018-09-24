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
  const idArr = ["6X", "FM", "DM", "AC", "SL"];
  const { partNumbers } = req.body;
  console.log(req.body);
  //let parsedPartNumbers = JSON.parse(partNumbers);

  let result = [];
  let truthTable = {};
  for (let j = 0; j < idArr.length; j++) {
    for (let i = 0; i < partNumbers.length; i++) {
      if (!truthTable[partNumbers[i]]) {
        let prefillNumber = `${idArr[j]}${partNumbers[i]}`;
        console.log("Num part", prefillNumber);
        let resultData = await db.getPartPromise(prefillNumber);
        console.log("REs", resultData);
        if (resultData.length > 0) {
          truthTable[partNumbers[i]] = true;
          result.push(resultData);
        }
      } else {
        continue;
      }
    }
  }
  res.send({ result });
});

app.post("/partinfo", async (req, res) => {
  const { partNumbers } = req.body;
  console.log(req.body);
  //let parsedPartNumbers = JSON.parse(partNumbers);

  let result = [];
  for (let i = 0; i < partNumbers.length; i++) {
    let resultData = await db.getPartPromise(partNumbers[i]);
    //console.log(resultData);
    console.log(partNumbers[i]);
    result.push(resultData);
  }
  res.send({ result });
});

const port = process.env.PORT || 80;

app.listen(port, () => console.log(`Server running on port ${port}`));
