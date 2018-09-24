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
  // executeStatement();
});

function executeStatement(partNo, res) {
  request = new Request(
    `SELECT inmast.fpartno, inmast.frev, inmast.fcstscode, inmast.fdescript, inmast.fsource, inmast.fstdcost, inmast.fprice
      FROM M2MDATA01.dbo.inmast inmast
      WHERE (inmast.fpartno LIKE '${partNo}' AND inmast.fcstscode LIKE 'a')
      ORDER BY inmast.fpartno
      `,
    function(err) {
      if (err) {
        console.log(err);
      }
    }
  );
  let result = [];
  let data = [];
  request.on("row", function(columns) {
    //      console.log("columns",columns);
    columns.forEach(function(column) {
      if (column.value === null) {
        console.log("NULL");
      } else {
        console.log(column.metadata.colName);
        result.push({ [column.metadata.colName]: column.value });
        // result += column.value + " ";
      }
    });
    data.push(result);
    console.log(result);
    //    return res.send({ result });
    result = [];
  });

  request.on("done", function(rowCount, more) {
    console.log(rowCount + " rows returned");
  });
  request.on("requestCompleted", function(rowCount, more) {
    console.log("requestCompleted");
    res.send({ data });
  });
  connection.execSql(request);
}

function getPartPromise(partNo) {
  return new Promise((resolve, reject) => {
    console.log("started promise");
    request = new Request(
      `SELECT inmast.fpartno, inmast.frev, inmast.fcstscode, inmast.fdescript, inmast.fsource, inmast.fstdcost, inmast.fprice
              FROM M2MDATA01.dbo.inmast inmast
              WHERE (inmast.fpartno LIKE '${partNo}' AND inmast.fcstscode LIKE 'a')
              ORDER BY inmast.fpartno
              `,
      function(err) {
        if (err) {
          console.log(err);
          return reject(err);
        }
      }
    );
    let result = {};
    let data = [];
    request.on("row", function(columns) {
      //      console.log("columns",columns);
      columns.forEach(function(column) {
        if (column.value === null) {
          console.log("NULL");
        } else {
          let value = column.value ? column.value.toString().trim() : "";
          result[[column.metadata.colName]] = value;
        }
      });
      result["partNum"] = partNo;
      data.push(result);
      result = {};
    });

    request.on("done", function(rowCount, more) {
      console.log(rowCount + " rows returned");
    });
    request.on("requestCompleted", function(rowCount, more) {
      console.log("requestCompleted");
      return resolve(data);
    });
    connection.execSql(request);
  });
}

// function getPartInfo(partNum) {
//   return new Promise((resolve, reject) => {
//     console.log("started promise");
//     request = new Request(
//       `SELECT jomast.fsono, jomast.fjobno, jomast.fstatus, jomast.fpartno, joitem.fmqty, jodbom.fbompart, jodbom.ftotqty, inmast.flocate1, inmast.fmatlcost
//           FROM M2MDATA01.dbo.inmast inmast, M2MDATA01.dbo.jodbom jodbom, M2MDATA01.dbo.joitem joitem, M2MDATA01.dbo.jomast jomast
//           WHERE jodbom.fjobno = joitem.fjobno AND joitem.fjobno = jomast.fjobno AND inmast.fpartno = jodbom.fbompart AND ((jomast.fstatus='open') AND (jomast.fcompany Like '${partNum}') OR (jomast.fstatus='released') AND (jomast.fcompany Like '${partNum}') OR (jomast.fstatus='completed') AND (jomast.fcompany Like '${partNum}'))
//           ORDER BY jomast.fpartno`,
//       function(err) {
//         if (err) {
//           console.log(err);
//           return reject(err);
//         }
//       }
//     );
//     let result = {};
//     let data = [];
//     request.on("row", function(columns) {
//       //      console.log("columns",columns);
//       columns.forEach(function(column) {
//         if (column.value === null) {
//           console.log("NULL");
//         } else {
//           //console.log(column.metadata.colName);
//           //   result.push({ [column.metadata.colName]: column.value });
//           result[[column.metadata.colName]] = column.value;
//           // result += column.value + " ";
//         }
//       });
//       data.push(result);
//       // console.log(result);
//       //    return res.send({ result });
//       result = {};
//     });

//     request.on("done", function(rowCount, more) {
//       console.log(rowCount + " rows returned");
//     });
//     request.on("requestCompleted", function(rowCount, more) {
//       console.log("requestCompleted");
//       return resolve(data);
//       //res.send({ data });
//     });
//     connection.execSql(request);
//   });
// }

module.exports = { executeStatement, getPartPromise };
