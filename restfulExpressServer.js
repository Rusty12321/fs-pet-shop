const express = require("express");
const app = express();
// const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const pg = require("pg");
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const port = process.env.PORT || 3000;
pool.connect();

app.use(express.json());
// app.use(bodyParser.json());

app.get("/pets", (req, res) => {
  pool.query("SELECT * FROM pet").then((result) => {
    res.send(result.rows);
  });
});

app.get("/pets/:petID", (req, res) => {
  pool
    .query(`SELECT * FROM pet WHERE id = $1;`, [req.params.petID])
    .then((result) => {
      if (result.rows.length == 0) {
        res.status(404).send("Not Found");
      } else {
        res.send(result.rows);
      }
    });
});

app.post("/pets", (req, res) => {
  if (isNaN(req.body.age)) {
    res.status(400).send("Bad Request");
  } else {
    pool
      .query(
        `INSERT INTO pet (age, kind, name) VALUES ($1, $2, $3) RETURNING *`,
        [req.body.age, req.body.kind, req.body.name]
      )
      .then((result) => {
        res.status(201).send(result.rows);
      });
  }
});

app.patch("/pets/:petID", (req, res) => {
  if (isNaN(req.body.age) && req.body.age !== undefined) {
    res.status(400).send("Bad Request");
  } else {
    let key = Object.keys(req.body)[0];
    let value = Object.values(req.body)[0];
    pool
      .query(`UPDATE pet SET ${key} = $1 WHERE id = $2 RETURNING *`, [
        value,
        req.params.petID,
      ])
      .then((result) => {
        if (result.rows.length == 0) {
          res.status(404).send("Not Found");
        } else {
          res.status(202).send(result.rows);
        }
      });
  }
});

app.delete("/pets/:petID", (req, res) => {
  pool
    .query(`DELETE FROM pet WHERE id = $1 RETURNING *`, [req.params.petID])
    .then((result) => {
      if (result.rows.length == 0) {
        res.status(404).send("Not Found");
      } else {
        res.status(202).send(result.rows);
      }
    });
});

app.get("/*", (req, res) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`server is listening on port:${port}`);
});
