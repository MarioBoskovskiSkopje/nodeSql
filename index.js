const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db_mssql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/test', (req, res) => {
  res.send({ result: 0 });
});

app.get('/validate', (req, res) => {
  const { partNo } = req.query;
  if (partNo) {
    return db.executeStatement(partNo, res);
  }

  //  res.send(req.query);
});

app.post('/validateparts', async (req, res) => {
  const { typeCodes = ['6X'] } = req.body;

  const { idArr = [] } = req.body;
  if (typeCodes.length > 2) {
    for (let i = 0; i < typeCodes.length; i++) {
      const element = typeCodes[i];
      idArr.push(element);
    }
  }
  let filteredArray = idArr.filter((item, pos) => {
    return idArr.indexOf(item) == pos;
  });
  const { partNumbers } = req.body;
  console.log(req.body);
  //let parsedPartNumbers = JSON.parse(partNumbers);

  let result = [];
  let truthTable = {};
  for (let j = 0; j < filteredArray.length; j++) {
    for (let i = 0; i < partNumbers.length; i++) {
      if (!truthTable[partNumbers[i]]) {
        let prefillNumber = `${filteredArray[j]}${partNumbers[i]}`;
        console.log('Num part', prefillNumber);
        let resultData = await db.getPartPromise(prefillNumber);
        console.log('REs', resultData);
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

app.post('/partinfo', async (req, res) => {
  const { partNumbers } = req.body;
  console.log(req.body);
  //let parsedPartNumbers = JSON.parse(partNumbers);

  let result = [];
  let errors = [];
  for (let i = 0; i < partNumbers.length; i++) {
    let resultData = await db.getPartPromise(partNumbers[i]);
    console.log('RESULTDATA', resultData);
    // console.log(partNumbers[i]);
    if (resultData.length > 0) {
      result.push(resultData);
    } else {
      errors.push({ status: 1, partNum: partNumbers[i] });
    }
  }

  res.send({ result, errors });
});

const port = process.env.PORT || 80;

app.listen(port, () => console.log(`Server running on port ${port}`));
