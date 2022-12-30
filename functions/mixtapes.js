import { MixtapesService } from "../src/services/mixtapes.service";
import bodyParser from "body-parser";
import cors from "cors";
import customLogger from "./utils/logger";
import express from "express";
import morgan from "morgan";
import serverless from "serverless-http";

const app = express();
const router = express.Router();
const service = new MixtapesService();

// Set router base path for local dev
const routerBasePath =
  process.env.NODE_ENV === "dev"
    ? `/mixtapes`
    : `/.netlify/functions/mixtapes/`;

// ROUTES Definitions

router.get("/", async (req, res) => {
  const mixtapes = await service.findAll();
  res.json(mixtapes);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const mixtape = await service.findById(id);
  res.json(mixtape);
});

// eof ROUTES Definitions

// Attach logger
app.use(morgan(customLogger));

// Setup routes
app.use(routerBasePath, router);

// Apply express middlewares
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

exports.handler = serverless(app);
