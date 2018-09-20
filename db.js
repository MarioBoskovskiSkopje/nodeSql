const { Connection, Request, TYPES } = require("tedious");

const config = {
  userName: "SymPro",
  password: "k3d6ATTO8Loa",
  server: "69.63.100.74"
  // If you are on Microsoft Azure, you need this:
  //options: {encrypt: true, database: 'AdventureWorks'}
};

const connection = new Connection(config);
connection.on("connect", function(err) {
  // If no error, then good to proceed.
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected");
  executeStatement();
});

function executeStatement(partNo, res) {
  request = new Request(
    `SELECT inmast.fpartno, inmast.frev, inmast.fcstscode, inmast.fdescript, inmast.fsource, inmast.fstdcost, inmast.fprice
    FROM M2MDATA01.dbo.inmast inmast
    WHERE (inmast.fpartno Like ${partNo} AND inmast.fcstscode LIKE 'a')
    ORDER BY inmast.fpartno
    `,
    function(err) {
      if (err) {
        console.log(err);
      }
    }
  );
  let result = "";
  request.on("row", function(columns) {
    columns.forEach(function(column) {
      if (column.value === null) {
        console.log("NULL");
      } else {
        result += column.value + " ";
      }
    });
    console.log(result);
    return res.send({ result });
    result = "";
  });

  request.on("done", function(rowCount, more) {
    console.log(rowCount + " rows returned");
  });
  connection.execSql(request);
}

module.exports = { executeStatement };
