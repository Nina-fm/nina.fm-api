import { supabase } from "../lib/supabase";

export class AuthorsService {
  /**
   * Trouve tous les authors
   */
  async findAll() {
    const { data: authors, error } = await supabase
      .from("authors")
      .select("*");

    if (error) console.log(error);

    return authors;
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

    return author;
  }

}
