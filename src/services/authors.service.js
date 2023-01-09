import { supabase } from "../lib/supabase";

export class AuthorsService {
  /**
   * Format Author data
   */
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
   * Fetch all authors
   */
  async getAll() {
    const { data: authors, error } = await supabase
      .from("authors")
      .select("*");

    if (error) throw new Error(error.message);

    return authors.map((author) => AuthorsService.format(author));
  }

  /**
   * Find an author by ID
   */
  async getByID(id) {
    const { data: author, error } = await supabase
      .from("authors")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    return AuthorsService.format(author);
  }

  /**
   * Find authors by name
   */
  async findByName(name) {
    const { data: authors, error } = await supabase
      .from("authors")
      .select("*")
      .ilike("name", `%${name}%`);

    if (error) throw new Error(error.message);

    return AuthorsService.format(authors);
  }

  /**
   * Create a new author
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

  /**
   * Update an author
   */
  async update(id, authorData) {
    const { data: author, error } = await supabase
      .from("authors")
      .update({ ...authorData, updated_at: new Date() })
      .eq("id", id)
      .select();

    if (error) throw new Error(error.message);

    return author;
  }

  /**
   * Delete an author by ID
   */
  async delete(id) {
    const { error } = await supabase.from("authors").delete().eq("id", id);

    if (error) throw new Error(error.message);

    console.log({ error });
    return true;
  }
}
