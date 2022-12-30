import App from "./app";
import { AuthorsService } from "../src/services/authors.service";
import serverless from "serverless-http";

const { app, router } = App("authors");
const service = new AuthorsService();

router.get("/", async (req, res) => {
  const authors = await service.findAll();
  res.json(authors);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const author = await service.findById(id);
  res.json(author);
});

export const handler = serverless(app);
