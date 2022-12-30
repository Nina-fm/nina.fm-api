import { supabase } from "../lib/supabase";

export class AuthorsService {
  static formatAuthor(author) {
    return {
      ...author,
      avatar_url: author.avatar ? supabase.storage.from("avatars").getPublicUrl(author.avatar)
      .data.publicUrl : null
    }
  }

  /**
   * Trouve tous les authors
   */
  async findAll() {
    const { data: authors, error } = await supabase
      .from("authors")
      .select("*");

    if (error) console.log(error);

    return authors.map((author) => AuthorsService.formatAuthor(author));
  }

  /**
   * Trouve un author par id
   */
  async findById(id) {
    const { data: author, error } = await supabase
      .from("authors")
      .select("*")
      .eq("id", id)
      .single();

    if (error) console.log(error);

    return AuthorsService.formatAuthor(author);
  }

}
