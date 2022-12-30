import { AuthorsService } from "./authors.service";
import { supabase } from "../lib/supabase";

export class MixtapesService {
  static formatMixtape(mixtape) {
    return {
      ...mixtape,
      cover_url: supabase.storage.from("covers").getPublicUrl(mixtape.cover)
        .data.publicUrl,
      authors: mixtape.authors
        ? mixtape.authors.map(({ author, mixtape_id, author_id, ...rest }) => {
            const { updated_at, ...authorRest } = author;
            return AuthorsService.formatAuthor({
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
   * Trouve toutes les mixtapes
   */
  async findAll() {
    const { data: mixtapes, error } = await supabase
      .from("mixtapes")
      .select("*, authors:mixtapes_authors(*, author:authors(*)), tracks(*)");

    if (error) console.log(error);

    return mixtapes.map((mixtape) => MixtapesService.formatMixtape(mixtape));
  }

  /**
   * Trouve une mixtape par id
   */
  async findById(id) {
    const { data: mixtape, error } = await supabase
      .from("mixtapes")
      .select("*, authors:mixtapes_authors(*, author:authors(*)), tracks(*)")
      .eq("id", id)
      .single();

    if (error) console.log(error);

    return MixtapesService.formatMixtape(mixtape);
  }
}
