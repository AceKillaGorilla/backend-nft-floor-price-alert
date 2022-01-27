import { Client } from "pg";
import { config } from "dotenv";
import express, { query } from "express";
import cors from "cors";
import path from "path";

config();

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

module.exports = app;

app.use(express.json()); //add body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

const client = new Client(dbConfig);
// console.log(client);

client.connect();

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname + "/../index.html"));
});

// POST /notifications
app.post("/notifications", async (req, res) => {
  const {
    collection_id,
    collection_slug,
    set_price,
    notification_type,
    email,
  } = req.body;
  const submitNotification = await client.query(
    "INSERT INTO notifications (collection_id, collection_slug, set_price, notification_type, email) values ($1, $2, $3, $4, $5) returning *;",
    [collection_id, collection_slug, set_price, notification_type, email]
  );
  if (
    email.length === 0 ||
    set_price === 0 ||
    collection_id.length === 0 ||
    notification_type === 0
  ) {
    res.status(400).json({
      status: "failure",
      message: "Fill in missing fields",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: submitNotification,
    });
  }
});

// POST /collection
app.post("/collection", async (req, res) => {
  const { collection_id, collection_slug, collection_name } = req.body;
  const uploadCollection = await client.query(
    "INSERT INTO collections(collection_slug, collection_name) VALUES ($1, $2) returning *;",
    [collection_slug, collection_name]
  );
  if (collection_slug.length === 0 || collection_name.length === 0) {
    res.status(400).json({
      status: "failure",
      message: "missing collection slug or name",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: uploadCollection,
    });
  }
});

// GET /collections
app.get("/collections", async (req, res) => {
  const collectionsList = await client.query(
    "SELECT collection_name FROM collections;"
  );
  if (collectionsList.rowCount === 0) {
    res.status(400).json({
      status: "failure",
      message: "empty response",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: collectionsList.rows,
    });
  }
});

// GET /floor_price/:collection_id
app.get("/floor_price/:collection_id", async (req, res) => {
  const floorPrice = await client.query(
    "SELECT floor_price FROM floor_prices WHERE floor_price.collection_id = $1 ORDER BY snapshot_time DESC LIMIT 1;",
    [req.params.collection_id]
  );
  if (floorPrice.rowCount === 0) {
    res.status(400).json({
      status: "failure",
      message: "empty response",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: floorPrice,
    });
  }
});

//POST

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

export default app;
