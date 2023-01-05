import { supabase } from "../lib/supabase";

export class TracksService {
  /**
   * Find tracks by mixtape ID
   */
  async findByMixtape(mixtapeId) {
    const { data: tracks, error } = await supabase
      .from("tracks")
      .select("*")
      .eq("mixtape_id", mixtapeId);

    if (error) throw new Error(error.message);

    return tracks;
  }

  /**
   * Create new tracks
   */
  async createForMixtape(tracksData, mixtapeId) {
    const { data: tracks, error } = await supabase
      .from("tracks")
      .insert(tracksData.map((track, i) => ({ ...track, mixtape_id: mixtapeId, position: track.position || i })))
      .select();

    if (error) throw new Error(error.message);

    return tracks;
  }
}
