const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { Deta } = require("deta");

const deta = Deta();
const db = deta.Base("flowchart-fun");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "app/build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "app/build", "index.html"));
});

app.get("/api/flowcharts", async (req, res) => {
  try {
    const flowcharts = await db.fetch().next();
    res.json(flowcharts);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/api/flowcharts", async (req, res) => {
  const insertedChart = await db.put(req.body);
  res.status(201).json(insertedChart);
});

app.get("/api/flowcharts/:id", async (req, res) => {
  const { id } = req.params;
  const flowchart = await db.get(id);
  if (flowchart) {
    res.json(flowchart);
  } else {
    res.status(404).json({ message: "flowchart not found" });
  }
});

app.put("/api/flowcharts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, text } = req.body;
  const toPut = { key: id, title, text };
  const newItem = await db.put(toPut);
  return res.json(newItem);
});

app.delete("/api/flowcharts/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(id);
  res.json({ message: "deleted" });
});

module.exports = app;
