import bodyParser from "body-parser";
import cors from "cors";
import customLogger from "../utils/logger";
import express from "express";
import morgan from "morgan";

const App = (name) => {
  // Set router base path for local dev
  const routerBasePath =
    process.env.NODE_ENV === "dev"
      ? `/${name}`
      : `/.netlify/functions/${name}/`;

  const app = express();
  const router = express.Router();

  // Attach logger
  app.use(morgan(customLogger));

  // Setup routes
  app.use(routerBasePath, router);

  // Apply express middlewares
  router.use(cors());
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  return {
    app,
    router
  }
};

export default App
