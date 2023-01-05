import App from "./app";
import { AuthorsService } from "../src/services/authors.service";
import serverless from "serverless-http";

const { app, router } = App("authors");
const _authors = new AuthorsService();

router.get("/", async (req, res) => {
  try {
    const authors = await _authors.findAll();
    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const author = await _authors.findById(id);
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

export const handler = serverless(app);
