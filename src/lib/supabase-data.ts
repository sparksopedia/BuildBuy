import { supabase } from "./supabase";
import type { Rubric, EvalResponse, Dimension } from "./constants";

// ── Rubric CRUD ──────────────────────────────────────────────────

export async function getRubric(id: string): Promise<Rubric | null> {
  const { data, error } = await supabase
    .from("rubrics")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    org: data.org ?? "",
    title: data.title,
    description: data.description ?? "",
    authorName: data.author_name,
    dimensions: data.dimensions as unknown as Dimension[],
    scale: data.scale as unknown as Rubric["scale"],
    createdAt: data.created_at,
  };
}

export async function createRubric(rubric: Rubric): Promise<void> {
  const { error } = await supabase.from("rubrics").insert({
    id: rubric.id,
    org: rubric.org || null,
    title: rubric.title,
    description: rubric.description || null,
    author_name: rubric.authorName,
    dimensions: rubric.dimensions as unknown as Record<string, unknown>[],
    scale: rubric.scale as unknown as Record<string, unknown>,
    created_at: rubric.createdAt,
  });

  if (error) {
    throw new Error(`Failed to save rubric: ${error.message}`);
  }
}

export async function getRubricsByAuthor(authorName: string): Promise<Rubric[]> {
  const { data, error } = await supabase
    .from("rubrics")
    .select("*")
    .ilike("author_name", authorName)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((d) => ({
    id: d.id,
    org: d.org ?? "",
    title: d.title,
    description: d.description ?? "",
    authorName: d.author_name,
    dimensions: d.dimensions as unknown as Dimension[],
    scale: d.scale as unknown as Rubric["scale"],
    createdAt: d.created_at,
  }));
}

// ── Responses ────────────────────────────────────────────────────

export async function getResponses(rubricId: string): Promise<EvalResponse[]> {
  const { data, error } = await supabase
    .from("responses")
    .select("*")
    .eq("rubric_id", rubricId)
    .order("submitted_at", { ascending: true });

  if (error || !data) return [];

  return data.map((d) => ({
    id: d.id,
    evaluatorName: d.evaluator_name,
    role: d.role ?? "",
    scores: d.scores as unknown as Record<string, number | "na">,
    comment: d.comment ?? "",
    submittedAt: d.submitted_at,
  }));
}

export async function submitResponse(
  rubricId: string,
  response: Omit<EvalResponse, "id">
): Promise<void> {
  const { error } = await supabase.from("responses").insert({
    rubric_id: rubricId,
    evaluator_name: response.evaluatorName,
    role: response.role || null,
    scores: response.scores as unknown as Record<string, unknown>,
    comment: response.comment || null,
    submitted_at: response.submittedAt,
  });

  if (error) {
    throw new Error(`Failed to submit response: ${error.message}`);
  }
}

// ── Real-time subscription ───────────────────────────────────────

export function subscribeToResponses(
  rubricId: string,
  onUpdate: (responses: EvalResponse[]) => void
) {
  // Fetch initial data
  getResponses(rubricId).then(onUpdate);

  // Subscribe to inserts on responses for this rubric
  const channel = supabase
    .channel(`responses:${rubricId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "responses",
        filter: `rubric_id=eq.${rubricId}`,
      },
      () => {
        // Re-fetch all responses on any change
        getResponses(rubricId).then(onUpdate);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ── Custom Dimensions ────────────────────────────────────────────

export async function getSavedCustomDimensions(authorKey: string): Promise<Dimension[]> {
  const { data, error } = await supabase
    .from("custom_dimensions")
    .select("*")
    .eq("author_key", authorKey)
    .order("saved_at", { ascending: true });

  if (error || !data) return [];

  return data.map((d) => ({
    id: d.id,
    name: d.name,
    desc: d.desc ?? "",
    custom: true,
  }));
}

export async function saveCustomDimension(
  authorKey: string,
  dim: Dimension
): Promise<boolean> {
  const { error } = await supabase.from("custom_dimensions").upsert({
    id: dim.id,
    author_key: authorKey,
    name: dim.name,
    desc: dim.desc || null,
    saved_at: new Date().toISOString(),
  });

  return !error;
}

export async function deleteCustomDimension(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("custom_dimensions")
    .delete()
    .eq("id", id);

  return !error;
}
