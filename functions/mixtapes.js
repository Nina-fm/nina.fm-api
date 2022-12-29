import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import customLogger from "./utils/logger";
import express from "express";
import morgan from "morgan";
import serverless from "serverless-http";

const app = express();
const router = express.Router();

// gzip responses
router.use(compression());

// Set router base path for local dev
const routerBasePath =
  process.env.NODE_ENV === "dev"
    ? `/mixtapes`
    : `/.netlify/functions/mixtapes/`;

/* define routes */

router.get("/", (req, res) => {
  const html = `Nina.fm API`;
  res.send(html);
});

router.get("/users", (req, res) => {
  res.json({
    users: [
      {
        name: "steve",
      },
      {
        name: "joe",
      },
    ],
  });
});

router.get("/hello/", function (req, res) {
  res.send("hello world");
});

// Attach logger
app.use(morgan(customLogger));

// Setup routes
app.use(routerBasePath, router);

// Apply express middlewares
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

exports.handler = serverless(app);
