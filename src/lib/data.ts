import type { Rubric, EvalResponse, Dimension } from "./constants";

const BASE =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ── Rubric CRUD ──────────────────────────────────────────────────

export async function getRubric(id: string): Promise<Rubric | null> {
  const res = await fetch(`${BASE}/api/rubrics?id=${encodeURIComponent(id)}`);
  const d = await res.json();
  if (!d) return null;

  return {
    id: d.id,
    org: d.org ?? "",
    title: d.title,
    description: d.description ?? "",
    authorName: d.author_key,
    dimensions: d.dimensions as Dimension[],
    scale: d.scale as Rubric["scale"],
    createdAt: d.created_at,
  };
}

export async function createRubric(rubric: Rubric): Promise<void> {
  const res = await fetch(`${BASE}/api/rubrics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: rubric.id,
      org: rubric.org || null,
      title: rubric.title,
      description: rubric.description || null,
      author_name: rubric.authorName,
      author_key: rubric.authorName.trim().toLowerCase(),
      dimensions: rubric.dimensions,
      scale: rubric.scale,
      created_at: rubric.createdAt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to save rubric: ${err}`);
  }
}

export async function getRubricsByAuthor(authorName: string): Promise<Rubric[]> {
  const res = await fetch(`${BASE}/api/rubrics?author=${encodeURIComponent(authorName)}`);
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((d: Record<string, unknown>) => ({
    id: d.id as string,
    org: (d.org as string) ?? "",
    title: d.title as string,
    description: (d.description as string) ?? "",
    authorName: d.author_key as string,
    dimensions: d.dimensions as Dimension[],
    scale: d.scale as Rubric["scale"],
    createdAt: d.created_at as string,
  }));
}

// ── Responses ────────────────────────────────────────────────────

export async function getResponses(rubricId: string): Promise<EvalResponse[]> {
  const res = await fetch(
    `${BASE}/api/responses?rubric_id=${encodeURIComponent(rubricId)}`
  );
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((d: Record<string, unknown>) => ({
    id: d.id as string,
    evaluatorName: d.evaluator_name as string,
    role: (d.role as string) ?? "",
    scores: d.scores as Record<string, number | "na">,
    comment: (d.comment as string) ?? "",
    submittedAt: d.submitted_at as string,
  }));
}

export async function submitResponse(
  rubricId: string,
  response: Omit<EvalResponse, "id">
): Promise<void> {
  const res = await fetch(`${BASE}/api/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rubric_id: rubricId,
      evaluator_name: response.evaluatorName,
      role: response.role || null,
      scores: response.scores,
      comment: response.comment || null,
      submitted_at: response.submittedAt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to submit response: ${err}`);
  }
}

// ── Real-time subscription (polling) ────────────────────────────

export function subscribeToResponses(
  rubricId: string,
  onUpdate: (responses: EvalResponse[]) => void
) {
  getResponses(rubricId).then(onUpdate);

  const interval = setInterval(() => {
    getResponses(rubricId).then(onUpdate);
  }, 10_000);

  return () => clearInterval(interval);
}

// ── Custom Dimensions ────────────────────────────────────────────

export async function getSavedCustomDimensions(authorKey: string): Promise<Dimension[]> {
  const res = await fetch(
    `${BASE}/api/custom-dimensions?author_key=${encodeURIComponent(authorKey)}`
  );
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((d: Record<string, unknown>) => ({
    id: d.id as string,
    name: d.name as string,
    desc: (d.desc as string) ?? "",
    custom: true,
  }));
}

export async function saveCustomDimension(
  authorKey: string,
  dim: Dimension
): Promise<boolean> {
  const res = await fetch(`${BASE}/api/custom-dimensions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: dim.id,
      author_key: authorKey,
      name: dim.name,
      desc: dim.desc || null,
      saved_at: new Date().toISOString(),
    }),
  });
  return res.ok;
}

export async function deleteCustomDimension(id: string): Promise<boolean> {
  const res = await fetch(
    `${BASE}/api/custom-dimensions?id=${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
  return res.ok;
}
