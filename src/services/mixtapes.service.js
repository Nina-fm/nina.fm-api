import { BadRequestException, NotFoundException } from "../lib/utils/exception";

import { AuthorsService } from "./authors.service";
import { supabase } from "../lib/supabase";

export class MixtapesService {
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

  validateData(data) {
    const { authors, tracks, ...mixtapeData } = data;

    console.log({ data });
    if (!authors || !authors.length) {
      throw new BadRequestException("Mixtape should have at least one author.");
    }

    if (!tracks || !tracks.length) {
      throw new BadRequestException("Mixtape should have at least one track.");
    }

    return data;
  }

  /**
   * Trouve toutes les mixtapes
   */
  async findAll() {
    const { data: mixtapes, error } = await supabase
      .from("mixtapes")
      .select("*, authors:mixtapes_authors(*, author:authors(*)), tracks(*)");

    if (error) throw new Error(error.message);

    return mixtapes.map((mixtape) => MixtapesService.format(mixtape));
  }

  /**
   * Trouve une mixtape par id
   */
  async find(id) {
    const { data: mixtape, error } = await supabase
      .from("mixtapes")
      .select("*, authors:mixtapes_authors(*, author:authors(*)), tracks(*)")
      .eq("id", id)
      .single();

    if (error.code === "PGRST116")
      throw new NotFoundException("Resource not found.");

    if (error) throw new Error(error.message);

    return MixtapesService.format(mixtape);
  }

  /**
   * Assign authors to mixtape
   */
  async addAuthors(id, authorIds = []) {
    const { error } = await supabase.from("mixtapes_authors").insert(
      authorIds.map((authorId, position) => ({
        author_id: authorId,
        mixtape_id: id,
        position,
      }))
    );

    if (error) throw new Error(error.message);
  }

  /**
   * Crée une nouvelle mixtape
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
   * Delete a mixtape by ID
   */
  async delete(id) {
    const { error } = await supabase.from("mixtapes").delete().eq("id", id);
    
    if (error) throw new Error(error.message);

    console.log({ error });
    return true;
  }
}
