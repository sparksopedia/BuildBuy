import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { sql } from "@/lib/db";
import { getAdminToken, verifySessionToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const token = getAdminToken(req.headers.get("cookie"));
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 }
    );
  }

  const { type } = await req.json();

  const rubrics = await sql`
    SELECT id, title, description, author_name, dimensions, scale, created_at,
           (SELECT COUNT(*)::int FROM responses WHERE rubric_id = rubrics.id) AS response_count
    FROM rubrics
    ORDER BY created_at DESC
    LIMIT 100
  `;

  const recentResponses = await sql`
    SELECT r.evaluator_name, r.role, r.scores, r.comment, r.submitted_at,
           rb.title AS rubric_title, rb.id AS rubric_id
    FROM responses r
    LEFT JOIN rubrics rb ON rb.id = r.rubric_id
    ORDER BY r.submitted_at DESC
    LIMIT 200
  `;

  const [stats] = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM rubrics) AS total_rubrics,
      (SELECT COUNT(*)::int FROM responses) AS total_responses,
      (SELECT COUNT(DISTINCT author_key)::int FROM rubrics) AS total_authors
  `;

  let prompt: string;

  if (type === "content-review") {
    prompt = `You are a content moderation analyst for "Build or Buy," a web tool where teams create rubrics to evaluate build-vs-buy decisions.

Review the following rubric data for any content concerns:
- Inappropriate, offensive, or spam content in titles, descriptions, or dimension names
- Suspicious patterns (e.g. test/junk rubrics, bot-like activity)
- Potentially sensitive business information that users may have inadvertently exposed

Also review evaluator comments for similar concerns.

DATA:

Rubrics (${rubrics.length} most recent):
${JSON.stringify(rubrics.map(r => ({ id: r.id, title: r.title, description: r.description, author: r.author_name, dimensions: r.dimensions })), null, 2)}

Recent comments from responses:
${JSON.stringify(recentResponses.filter(r => r.comment).map(r => ({ rubric: r.rubric_title, evaluator: r.evaluator_name, comment: r.comment })), null, 2)}

Provide a structured content review with:
1. **Flagged Content** — any items needing attention (with rubric IDs)
2. **Spam/Bot Assessment** — patterns suggesting non-genuine usage
3. **Data Sensitivity** — any exposed business-sensitive information
4. **Overall Health** — content quality summary

If everything looks clean, say so clearly.`;
  } else {
    prompt = `You are a business intelligence analyst for "Build or Buy," a web tool where teams create structured rubrics to evaluate build-vs-buy technology decisions, then collect scored evaluations from multiple stakeholders.

Analyze the following platform data and provide actionable insights.

PLATFORM STATS:
- Total rubrics: ${stats.total_rubrics}
- Total responses: ${stats.total_responses}
- Unique authors: ${stats.total_authors}

RUBRIC DATA (${rubrics.length} most recent):
${JSON.stringify(rubrics.map(r => ({
  id: r.id, title: r.title, description: r.description,
  author: r.author_name, dimensions: r.dimensions,
  scale: r.scale, created: r.created_at, responses: r.response_count,
})), null, 2)}

RECENT RESPONSES (${recentResponses.length} most recent):
${JSON.stringify(recentResponses.map(r => ({
  rubric: r.rubric_title, rubric_id: r.rubric_id,
  evaluator: r.evaluator_name, role: r.role,
  scores: r.scores, comment: r.comment, submitted: r.submitted_at,
})), null, 2)}

Provide a comprehensive analysis covering:

1. **Use Case Classification** — what types of decisions are users evaluating? Group by industry/domain if possible.
2. **Engagement Patterns** — which rubrics get the most responses? What makes them successful?
3. **Scoring Insights** — are there common scoring patterns? Dimensions that consistently score high or low? Any outlier responses?
4. **Author Behavior** — power users vs. one-time users, rubric complexity trends
5. **Platform Health** — completion rates (rubrics with 0 responses), average evaluators per rubric, dimension count trends
6. **Recommendations** — specific, actionable suggestions for improving the platform based on the data

Be specific and reference actual data points. Use rubric IDs when referencing specific items.`;
  }

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high" },
    messages: [{ role: "user", content: prompt }],
  });

  let analysisText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      analysisText += block.text;
    }
  }

  await sql`
    INSERT INTO admin_audit_log (action, target_type, details)
    VALUES ('ai_analysis', ${type}, ${JSON.stringify({
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    })}::jsonb)
  `;

  return NextResponse.json({
    analysis: analysisText,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  });
}
