import express from "express";
import bodyParser from "body-parser";
import ttnWebhooksRouter from "./ttnWebhooks";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/application/:applicationName", ttnWebhooksRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
