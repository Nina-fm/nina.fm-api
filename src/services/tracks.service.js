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
      .insert(
        tracksData.map((track, i) => ({
          ...track,
          mixtape_id: mixtapeId,
          position: track.position || i,
        }))
      )
      .select();

    if (error) throw new Error(error.message);

    return tracks;
  }

  /**
   * Update tracks
   */
  async updateForMixtape(tracksData, mixtapeId) {
    console.log({ tracksData, mixtapeId });
    const tracksDataIds = tracksData.reduce(
      (res, track) => [...res, track.id],
      []
    );

    const { data: existing } = await supabase
      .from("tracks")
      .select("id")
      .eq("mixtape_id", mixtapeId);

    const toDeleteIds = existing ? existing.filter(
      (track) => track.id && !tracksDataIds.includes(track.id)
    ) : [];

    const { error: deleteError } = await supabase
      .from("tracks")
      .delete()
      .in("id", toDeleteIds);

    const { data: tracks, error } = await supabase
      .from("tracks")
      .upsert(
        tracksData.map((track, i) => ({
          ...track,
          mixtape_id: mixtapeId,
          position: track.position || i,
        }))
      )
      .select();

    if (error) throw new Error(error.message);

    return tracks;
  }
}
