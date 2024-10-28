import express from "express";
const ttnWebhooksRouter = express.Router({ mergeParams: true });

let data = {};

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
    [`data_for_${req.params.applicationName}`]:
      data[req.params.applicationName],
  })
);

ttnWebhooksRouter.post("/", (req, res) => {
  if (data[req.params.applicationName]) {
    data[req.params.applicationName].push(req.body);
  } else {
    data[req.params.applicationName] = [req.body];
  }
  res.json({
    message: "Added packet",
  });
});

export default ttnWebhooksRouter;
