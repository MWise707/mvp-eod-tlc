import express from "express";
import fs from "fs";
import pg from "pg";

const app = express();
const expressPort = 8001;

const db = new pg.Pool({
  connectionString: "postgres://localhost/eod-tlc",
});

app.use(express.json());
app.use(express.static("public"));

app.get("/techs", (req, res, next) => {
  db.query("SELECT * FROM techs")
    .then((results) => {
      res.send(results.rows);
    })
    .catch((err) => {
      console.error("Error in /techs route: ", err);
      next(err);
    });
});

app.get("/techs/:id", (req, res, next) => {
  const { id } = req.params;
  db.query("SELECT * FROM techs WHERE platoon_id = $1", [id])
    .then((results) => {
      res.send(results.rows);
    })
    .catch((err) => {
      console.error("Error in getting techs platoon: ", err);
      next(err);
    });
});

app.get("/*", (req, res, next) => {
  res.status(500).send("Bad Request- Not formatted correctly");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error- Something went wrong");
});

app.listen(expressPort, () => {
  console.log("Listening on Port: ", expressPort);
});
