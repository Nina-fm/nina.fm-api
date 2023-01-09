import App from "./app";
import { AuthorsService } from "../src/services/authors.service";
import serverless from "serverless-http";

const { app, router } = App("authors");
const _authors = new AuthorsService();

router.get("/", async (req, res, next) => {
  try {
    const name = req.query.name;
    const authors = name
      ? await _authors.findByName(name)
      : await _authors.getAll();
    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const author = await _authors.getByID(id);
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const author = await _authors.update(id, req.body);
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const author = await _authors.delete(id);
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

export const handler = serverless(app);
