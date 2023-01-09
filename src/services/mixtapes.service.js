import { BadRequestException, NotFoundException } from "../lib/utils/exception";

import { AuthorsService } from "./authors.service";
import { supabase } from "../lib/supabase";

export class MixtapesService {
  /**
   * Format mixtape data
   */
  static format(mixtape) {
    return {
      ...mixtape,
      cover_url: mixtape.cover
        ? supabase.storage.from("covers").getPublicUrl(mixtape.cover).data
            .publicUrl
        : null,
      authors: mixtape.authors
        ? mixtape.authors.map(({ author, mixtape_id, author_id, ...rest }) => {
            const { updated_at, ...authorRest } = author;
            return AuthorsService.format({
              ...rest,
              ...authorRest,
            });
          })
        : [],
      tracks: mixtape.tracks
        ? mixtape.tracks.map(({ id, created_at, mixtape_id, ...track }) => ({
            ...track,
          }))
        : [],
    };
  }

  /**
   * Validate mixtape POST Data or throwing errors
   */
  validateData(data) {
    const { authors, tracks, ...mixtapeData } = data;

    if (!authors || !authors.length) {
      throw new BadRequestException("Mixtape should have at least one author.");
    }

    if (!tracks || !tracks.length) {
      throw new BadRequestException("Mixtape should have at least one track.");
    }

    return data;
  }

  /**
   * Fetch all mixtapes
   */
  async findAll() {
    const { data: mixtapes, error } = await supabase
      .from("mixtapes")
      .select("*, authors:mixtapes_authors(*, author:authors(*)), tracks(*)");

    if (error) throw new Error(error.message);

    return mixtapes.map((mixtape) => MixtapesService.format(mixtape));
  }

  /**
   * Find a mixtape by ID
   */
  async find(id) {
    const { data: mixtape, error } = await supabase
      .from("mixtapes")
      .select("*, authors:mixtapes_authors(*, author:authors(*)), tracks(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundException("Resource not found.");
      } else {
        throw new Error(error.message);
      }
    }

    return MixtapesService.format(mixtape);
  }

  /**
   * Add authors to mixtape
   */
  async addAuthors(id, authorIds = []) {
    const { error } = await supabase.from("mixtapes_authors").insert(
      authorIds.map((authorId, position) => ({
        author_id: authorId,
        mixtape_id: id,
        position,
      })),
      { upsert: true }
    );

    if (error) throw new Error(error.message);
  }

  /**
   * Update authors to mixtape
   */
  async updateAuthors(id, authorIds = []) {
    const { data: existing } = await supabase
      .from("mixtapes_authors")
      .select("*")
      .eq("mixtape_id", id);

    const toDeleteIds = existing
      .filter((ma) => !authorIds.includes(ma.author_id))
      .reduce((res, ma) => [...res, ma.author_id], []);

    const { error: deleteError } = await supabase
      .from("mixtapes_authors")
      .delete()
      .eq("mixtape_id", id)
      .in("author_id", toDeleteIds);

    const { error } = await supabase.from("mixtapes_authors").upsert(
      authorIds.map((authorId, position) => ({
        author_id: authorId,
        mixtape_id: id,
        position,
      })),
      { onConflict: "mixtape_id,author_id" }
    );

    if (error) throw new Error(error.message);
  }

  /**
   * Create a new mixtape
   */
  async create(mixtapeData) {
    const { data: mixtape, error } = await supabase
      .from("mixtapes")
      .insert([mixtapeData])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return mixtape;
  }

  /**
   * Update a mixtape by ID
   */
  async update(id, mixtapeData) {
    console.log({ id, mixtapeData });
    const { data: mixtape, error } = await supabase
      .from("mixtapes")
      .update({ ...mixtapeData, updated_at: new Date() })
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);

    return mixtape;
  }

  /**
   * Delete a mixtape by ID
   */
  async delete(id) {
    const { error } = await supabase.from("mixtapes").delete().eq("id", id);

    if (error) throw new Error(error.message);

    console.log({ error });
    return true;
  }
}
