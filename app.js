import express from "express";
import fs from "fs";
import pg from "pg";
import "dotenv/config";

const app = express();
const expressPort = 8001;

const connectionString = process.env.DATABASE_URL;
const db = new pg.Pool({
  connectionString,
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

app.post("/techs", (req, res, next) => {
  console.log(req.body);
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
        console.error("Error adding new Tech: ", err.stack);
        next(err);
      });
  }
});

app.delete("/techs/:id", (req, res, next) => {
  const { id } = req.params;
  db.query("DELETE FROM techs WHERE tech_id = $1", [id])
    .then((data) => {
      console.log("Deleted succssfully:", data);
      res.status(200).send("Successfully removed Tech");
    })
    .catch((err) => {
      console.error("Error removing Tech:", err.stack);
      next(err);
    });
});

app.patch("/techs/:id", (req, res, next) => {
  const { id } = req.params;
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
  if (rank) {
    db.query("UPDATE techs SET rank = $1 WHERE tech_id = $2", [rank, id])
      .then(() => {
        res.status(200).send(`Updated rank to ${rank}`);
      })
      .catch((err) => {
        console.error("Error updating rank", err.stack);
        next(err);
      });
  }
  if (first_name) {
    db.query("UPDATE techs SET first_name = $1 WHERE tech_id = $2", [
      first_name,
      id,
    ])
      .then(() => {
        res.status(200).send(`Updated first_name to ${first_name}`);
      })
      .catch((err) => {
        console.error("Error updating first_name", err.stack);
        next(err);
      });
  }
  if (last_name) {
    db.query("UPDATE techs SET last_name = $1 WHERE tech_id = $2", [
      last_name,
      id,
    ])
      .then(() => {
        res.status(200).send(`Updated last_name to ${last_name}`);
      })
      .catch((err) => {
        console.error("Error updating rank", err.stack);
        next(err);
      });
  }
  if (position) {
    db.query("UPDATE techs SET position = $1 WHERE tech_id = $2", [
      position,
      id,
    ])
      .then(() => {
        res.status(200).send(`Updated position to ${position}`);
      })
      .catch((err) => {
        console.error("Error updating position", err.stack);
        next(err);
      });
  }
  if (is_tlc_complete) {
    db.query("UPDATE techs SET is_tlc_complete = $1 WHERE tech_id = $2", [
      is_tlc_complete,
      id,
    ])
      .then(() => {
        res.status(200).send(`Updated is_tlc_complete to ${is_tlc_complete}`);
      })
      .catch((err) => {
        console.error("Error updating is_tlc_complete", err.stack);
        next(err);
      });
  }
  if (percent_complete) {
    db.query("UPDATE techs SET percent_complete = $1 WHERE tech_id = $2", [
      percent_complete,
      id,
    ])
      .then(() => {
        res.status(200).send(`Updated percent_complete to ${percent_complete}`);
      })
      .catch((err) => {
        console.error("Error updating percent_complete", err.stack);
        next(err);
      });
  }
  if (platoon_id) {
    db.query("UPDATE techs SET platoon_id = $1 WHERE tech_id = $2", [
      platoon_id,
      id,
    ])
      .then(() => {
        res.status(200).send(`Updated platoon_id to ${platoon_id}`);
      })
      .catch((err) => {
        console.error("Error updating platoon_id", err.stack);
        next(err);
      });
  }
  if (team_id) {
    db.query("UPDATE techs SET team_id = $1 WHERE tech_id = $2", [team_id, id])
      .then(() => {
        res.status(200).send(`Updated team_id to ${team_id}`);
      })
      .catch((err) => {
        console.error("Error updating team_id", err.stack);
        next(err);
      });
  }
  if (is_officer) {
    db.query("UPDATE techs SET is_officer = $1 WHERE tech_id = $2", [
      is_officer,
      id,
    ])
      .then(() => {
        res.status(200).send(`Updated is_officer to ${is_officer}`);
      })
      .catch((err) => {
        console.error("Error updating is_officer", err.stack);
        next(err);
      });
  }
  if (badge_level) {
    db.query("UPDATE techs SET badge_level = $1 WHERE tech_id = $2", [
      badge_level,
      id,
    ])
      .then(() => {
        res.status(200).send(`Updated badge_level to ${badge_level}`);
      })
      .catch((err) => {
        console.error("Error updating badge_level", err.stack);
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
