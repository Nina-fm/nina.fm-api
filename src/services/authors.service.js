import { supabase } from "../lib/supabase";

export class AuthorsService {
  static format(author) {
    return {
      ...author,
      avatar_url: author.avatar
        ? supabase.storage.from("avatars").getPublicUrl(author.avatar).data
            .publicUrl
        : null,
      ...(author.mixtapes ? { mixtape_count: author.mixtapes.length } : {}),
    };
  }

  /**
   * Trouve tous les authors
   */
  async findAll() {
    const { data: authors, error } = await supabase
      .from("authors")
      .select("*, mixtapes:mixtapes_authors(id)");

    if (error) throw new Error(error.message);

    return authors.map((author) => AuthorsService.format(author));
  }

  /**
   * Trouve un author par id
   */
  async findById(id) {
    const { data: author, error } = await supabase
      .from("authors")
      .select("*, mixtapes:mixtapes_authors(id)")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    return AuthorsService.format(author);
  }

  /**
   * Create new author
   */
  async create(authorData) {
    const { data: author, error } = await supabase
      .from("authors")
      .insert([authorData])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return author;
  }
}
