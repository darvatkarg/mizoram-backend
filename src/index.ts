/**
 * @author Mukund Khunt
 * @description Server and REST API config
 */
import * as bodyParser from "body-parser";
import express from "express";
import http from "http";
import cors from "cors";
import * as packageInfo from "../package.json";
import { mongooseConnection } from "./database";
import { router } from "./routes";
import { onConnect } from "./helpers/socket";
import { every_minutes_running_cron_job } from "./helpers/cron";

const app = express();
every_minutes_running_cron_job.start();
app.use(mongooseConnection);

let server = new http.Server(app);
let io = require("socket.io")(server, {
  cors: true,
});
io.on("connection", onConnect);

app.use(cors());
app.use("/upload", express.static(process.cwd() + "/upload"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const health = (req, res) => {
  return res.status(200).json({
    message: "Read It Out Node.js Server is Running",
    app: packageInfo.name,
    version: packageInfo.version,
    description: packageInfo.description,
    author: packageInfo.author,
    license: packageInfo.license,
    homepage: packageInfo.homepage,
    repository: packageInfo.repository,
    contributors: packageInfo.contributors,
  });
};
app.get("/", health);
app.get("/health", health);
app.get("/isServerUp", (req, res) => {
  res.send("Server is running ");
});
app.use(router);

app.listen(3000, () => {
  console.log("Server runnning on port 3000");
});

export default server;
