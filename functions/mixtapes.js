import App from "./app";
import { MixtapesService } from "../src/services/mixtapes.service";
import serverless from "serverless-http";

const { app, router } = App("mixtapes");
const service = new MixtapesService();

router.get("/", async (req, res) => {
  const mixtapes = await service.findAll();
  res.json(mixtapes);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const mixtape = await service.findById(id);
  res.json(mixtape);
});

export const handler = serverless(app);
