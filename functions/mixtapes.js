import App from "./app";
import { AuthorsService } from "../src/services/authors.service";
import { MixtapesService } from "../src/services/mixtapes.service";
import { TracksService } from "../src/services/tracks.service";
import serverless from "serverless-http";

const { app, router } = App("mixtapes");
const _mixtapes = new MixtapesService();
const _authors = new AuthorsService();
const _tracks = new TracksService();

router.get("/", async (req, res, next) => {
  try {
    const mixtapes = await _mixtapes.findAll();
    res.status(200).json(mixtapes);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const mixtape = await _mixtapes.find(id);
    res.status(200).json(mixtape);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await _mixtapes.delete(id);
    res.status(200).send(deleted);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { authors, tracks, ...data } = _mixtapes.validateData(
      req.body
    );
    
    // Create the mixtape
    const mixtape = await _mixtapes.create(data);
    // Add all authors to the mixtape and create them if not exists
    const allAuthors = await Promise.all(
      authors.map(async (author) =>
        !author.id ? await _authors.create(author) : author
      )
    );
    const authorsIds = allAuthors.map((a) => a.id);
    const mixtapesAuthors = await _mixtapes.addAuthors(
      mixtape.id,
      authorsIds
    );
    // Create all tracks
    const allTracks = await _tracks.createForMixtape(tracks, mixtape.id);

    res.status(201).json(mixtape);
  } catch (error) {
    next(error);
  }
});

export const handler = serverless(app);
