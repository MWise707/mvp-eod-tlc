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

//TODO
app.post("/techs", (req, res, next) => {
  const {
    rank,
    first_name,
    last_name,
    position,
    is_tlc_complete,
    percent_complete,
    platoon_id,
    team_id,
    is_officer,
    badge_level,
  } = req.body;
  if (!rank || !first_name || !last_name) {
    res
      .status(400)
      .set("Content-type", "text/plain")
      .send("Bad request: Missing rank, first name, or last name");
  } else {
    db.query(
      "INSERT INTO techs (tech_id, rank, first_name, last_name, position, is_tlc_complete, percent_complete, platoon_id, team_id, is_officer, badge_level) VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        rank,
        first_name,
        last_name,
        position,
        is_tlc_complete,
        percent_complete,
        platoon_id,
        team_id,
        is_officer,
        badge_level,
      ]
    )
      .then((newTech) => {
        console.log("Added new Tech: ", rank, last_name);
        res.send([rank, last_name]);
      })
      .catch((err) => {
        console.error("Error add new Tech: ", err.stack);
        next(err);
      });
  }
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
