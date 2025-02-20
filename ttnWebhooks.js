import express from "express";
import MILLISECONDS_IN_DAY from "@stdlib/constants-time-milliseconds-in-day";
import { inspect } from "util";
import { parse, stringify } from "flatted/esm";

const ttnWebhooksRouter = express.Router({ mergeParams: true });

const DATA_RETENTION_PERIOD = 14; // days
const DATA_RETENTION_PERIOD_IN_MS = DATA_RETENTION_PERIOD * MILLISECONDS_IN_DAY;

let packets = {};
let requests = {};
let lastClearData = Date.now();

// If in doubt, clear important data from memory 😅😅😅
function freeUpMemory() {
  if (Date.now() < lastClearData + DATA_RETENTION_PERIOD_IN_MS) return;

  packets = {};
  requests = {};
  lastClearData = Date.now();
}

/**
 *
 * @param {Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>} req
 */
function parseImportantRequestDetails(req) {
  return {
    headers: req.headers,
    body: req.body,
  };
}

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log(
    "Time: ",
    Date.now(),
    "\tApplication name:",
    req.params.applicationName
  );
  next();
};

ttnWebhooksRouter.use(timeLog);

ttnWebhooksRouter.get("/", (req, res) =>
  res.json({
    application_name: req.params.applicationName,
    packets: packets[req.params.applicationName],
    requests: requests[req.params.applicationName],
  })
);

ttnWebhooksRouter.post("/", (req, res) => {
  freeUpMemory();
  const parsedReq = parseImportantRequestDetails(req);
  if (packets[req.params.applicationName]) {
    packets[req.params.applicationName].push(req.body);
    requests[req.params.applicationName].push(parsedReq);
  } else {
    packets[req.params.applicationName] = [req.body];
    requests[req.params.applicationName] = [parsedReq];
  }

  res.json({
    message: "Added packet",
  });
});

ttnWebhooksRouter.get("/clear", (req, res) => {
  packets[req.params.applicationName] = [];
  requests[req.params.applicationName] = [];
  res.json({
    message: "Cleared all packets",
  });
});

export default ttnWebhooksRouter;
