import { supabase } from "../lib/supabase";

export class MixtapesService {
  formatMixtape(mixtape) {
    const coverUrl = supabase.storage
      .from("covers")
      .getPublicUrl(mixtape.cover);

    return {
      ...mixtape,
      cover_url: coverUrl.data.publicUrl,
      authors: mixtape.authors ? mixtape.authors.map(
        ({ author, mixtape_id, author_id, ...rest }) => ({
          ...rest,
          ...author,
        })
      ) : [],
      tracks: mixtape.tracks ? mixtape.tracks.map(
        ({ id, created_at, mixtape_id, ...track }) => ({
          ...track,
        })
      ) : [],
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

    return mixtapes.map((mixtape) => this.formatMixtape(mixtape));
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

    return this.formatMixtape(mixtape);
  }
}
