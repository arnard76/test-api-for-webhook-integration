import express from "express";
import bodyParser from "body-parser";
import ttnWebhooksRouter from "./ttnWebhooks.js";
import cors from "cors"

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // This allows all origins to access your API.
app.use(bodyParser.json());
app.use("/application/:applicationName", ttnWebhooksRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
