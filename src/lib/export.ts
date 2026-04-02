import type { Rubric, EvalResponse } from "./constants";

interface DimAvg {
  id: string;
  name: string;
  custom?: boolean;
  avg: number | null;
  ratio: number | null;
  naCount: number;
  ratedCount: number;
  verdict: string;
}

interface ExportData {
  dimAvgs: DimAvg[];
  overallAvg: number | null;
  overallRatio: number | null;
  overallVerdict: string;
}

export function buildExportData(rubric: Rubric, responses: EvalResponse[]): ExportData {
  const dimAvgs: DimAvg[] = rubric.dimensions.map((d) => {
    const rated = responses
      .map((r) => r.scores[d.id])
      .filter((v): v is number => v !== undefined && v !== "na");
    const avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : null;
    const ratio =
      avg !== null ? (avg - rubric.scale.min) / (rubric.scale.max - rubric.scale.min) : null;
    const naCount = responses.filter((r) => r.scores[d.id] === "na").length;
    const verdict =
      ratio === null
        ? "N/A"
        : ratio < 0.3
          ? "Strong Build"
          : ratio < 0.5
            ? "Lean Build"
            : ratio < 0.7
              ? "Lean Buy"
              : "Strong Buy";
    return { ...d, avg, ratio, naCount, ratedCount: rated.length, verdict };
  });
  const validAvgs = dimAvgs.filter((d) => d.avg !== null).map((d) => d.avg!);
  const overallAvg = validAvgs.length
    ? validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length
    : null;
  const overallRatio =
    overallAvg !== null
      ? (overallAvg - rubric.scale.min) / (rubric.scale.max - rubric.scale.min)
      : null;
  const overallVerdict =
    overallRatio === null
      ? "N/A"
      : overallRatio < 0.3
        ? "Strong Build"
        : overallRatio < 0.5
          ? "Lean Build"
          : overallRatio < 0.7
            ? "Lean Buy"
            : "Strong Buy";
  return { dimAvgs, overallAvg, overallRatio, overallVerdict };
}

export function exportCSV(rubric: Rubric, responses: EvalResponse[]) {
  const { dimAvgs, overallAvg, overallVerdict } = buildExportData(rubric, responses);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows: unknown[][] = [];

  rows.push(["BUILD VS. BUY EVALUATION REPORT"]);
  if (rubric.org) rows.push([`Organization: ${rubric.org}`]);
  rows.push([`Capability: ${rubric.title}`]);
  if (rubric.description) rows.push([`Context: ${rubric.description}`]);
  rows.push([`Author: ${rubric.authorName}`]);
  rows.push([
    `Scale: ${rubric.scale.label}  (${rubric.scale.min} = Build internally · ${rubric.scale.max} = Buy commercially · N/A = cannot assess)`,
  ]);
  rows.push([`Total Evaluators: ${responses.length}`]);
  rows.push([`Exported: ${new Date().toLocaleString()}`]);
  rows.push([]);

  rows.push(["AGGREGATE RESULT"]);
  rows.push(["Overall Average", "Verdict"]);
  rows.push([overallAvg !== null ? overallAvg.toFixed(2) : "N/A", overallVerdict]);
  rows.push([]);

  rows.push(["DIMENSION AVERAGES"]);
  rows.push(["Dimension", "Type", "Average", "Verdict", "Rated By", "N/A Count"]);
  dimAvgs.forEach((d) => {
    rows.push([
      d.name,
      d.custom ? "Custom" : "Library",
      d.avg !== null ? d.avg.toFixed(2) : "N/A",
      d.verdict,
      `${d.ratedCount} of ${responses.length}`,
      d.naCount,
    ]);
  });
  rows.push([]);

  rows.push(["INDIVIDUAL SCORES"]);
  rows.push([
    "Evaluator",
    "Role",
    ...rubric.dimensions.map((d) => d.name),
    "Average",
    "Verdict",
    "Submitted",
  ]);
  responses.forEach((r) => {
    const rated = rubric.dimensions
      .map((d) => r.scores[d.id])
      .filter((v): v is number => v !== undefined && v !== "na");
    const avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : null;
    const ratio =
      avg !== null ? (avg - rubric.scale.min) / (rubric.scale.max - rubric.scale.min) : null;
    const verdict =
      ratio === null
        ? ""
        : ratio < 0.3
          ? "Strong Build"
          : ratio < 0.5
            ? "Lean Build"
            : ratio < 0.7
              ? "Lean Buy"
              : "Strong Buy";
    rows.push([
      r.evaluatorName,
      r.role || "",
      ...rubric.dimensions.map((d) =>
        r.scores[d.id] === "na" ? "N/A" : (r.scores[d.id] ?? "")
      ),
      avg !== null ? avg.toFixed(2) : "",
      verdict,
      new Date(r.submittedAt).toLocaleString(),
    ]);
  });

  const withComments = responses.filter((r) => r.comment?.trim());
  if (withComments.length > 0) {
    rows.push([]);
    rows.push(["EVALUATOR COMMENTS"]);
    rows.push(["Evaluator", "Role", "Average", "Verdict", "Comment"]);
    withComments.forEach((r) => {
      const rated = rubric.dimensions
        .map((d) => r.scores[d.id])
        .filter((v): v is number => v !== undefined && v !== "na");
      const avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : null;
      const ratio =
        avg !== null ? (avg - rubric.scale.min) / (rubric.scale.max - rubric.scale.min) : null;
      const verdict =
        ratio === null
          ? ""
          : ratio < 0.3
            ? "Strong Build"
            : ratio < 0.5
              ? "Lean Build"
              : ratio < 0.7
                ? "Lean Buy"
                : "Strong Buy";
      rows.push([r.evaluatorName, r.role || "", avg !== null ? avg.toFixed(2) : "", verdict, r.comment]);
    });
  }

  const csv = rows.map((row) => row.map(esc).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${rubric.title.replace(/[^a-z0-9]/gi, "_")}_buildbuy_${rubric.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportPDF(rubric: Rubric, responses: EvalResponse[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { dimAvgs, overallAvg, overallRatio, overallVerdict } = buildExportData(
    rubric,
    responses
  );

  const W = 210,
    M = 16,
    COL = W - M * 2;
  const NAVY: [number, number, number] = [26, 39, 68],
    AMBER: [number, number, number] = [200, 146, 42],
    MID: [number, number, number] = [107, 114, 128];
  const LGRAY: [number, number, number] = [229, 231, 235],
    FGRAY: [number, number, number] = [249, 250, 251],
    WHITE: [number, number, number] = [255, 255, 255];
  let y = 0;

  const pageCheck = (h = 10) => {
    if (y + h > 274) {
      doc.addPage();
      y = M;
    }
  };

  const verdictColor = (ratio: number | null): [number, number, number] => {
    if (ratio === null) return MID;
    if (ratio < 0.3) return [29, 78, 216];
    if (ratio < 0.5) return [37, 99, 235];
    if (ratio < 0.7) return [22, 163, 74];
    return [21, 128, 61];
  };

  // Header band
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 30, "F");
  doc.setFillColor(...AMBER);
  doc.rect(0, 30, W, 1.5, "F");
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("BUILD VS. BUY EVALUATION", M, 10);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${rubric.scale.min} = Build internally  ·  ${rubric.scale.max} = Buy commercially  ·  N/A = cannot assess`,
    M,
    16
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const titleLines = doc.splitTextToSize(rubric.title, COL);
  doc.text(titleLines, M, 25);
  y = 40;

  // Meta
  const meta: [string, string][] = [];
  if (rubric.org) meta.push(["Organization", rubric.org]);
  meta.push(["Author", rubric.authorName]);
  meta.push(["Scale", rubric.scale.label]);
  meta.push(["Evaluators", `${responses.length}`]);
  meta.push(["Exported", new Date().toLocaleString()]);
  if (rubric.description) meta.push(["Context", rubric.description]);

  meta.forEach(([k, v]) => {
    const lines = doc.splitTextToSize(v, COL - 34);
    const h = Math.max(6, lines.length * 5);
    pageCheck(h);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...MID);
    doc.text(k.toUpperCase(), M, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    doc.text(lines, M + 34, y);
    y += h;
  });

  // Verdict card
  if (overallAvg !== null && overallRatio !== null) {
    y += 5;
    pageCheck(28);
    const vc = verdictColor(overallRatio);
    const vbg: [number, number, number] =
      overallRatio < 0.5 ? [219, 234, 254] : [220, 252, 231];
    doc.setFillColor(...FGRAY);
    doc.roundedRect(M, y, COL, 26, 3, 3, "F");
    doc.setFillColor(...vbg);
    doc.roundedRect(M + 4, y + 4, 34, 12, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...vc);
    doc.text(overallVerdict.toUpperCase(), M + 21, y + 11.5, { align: "center" });
    doc.setFontSize(20);
    doc.setTextColor(...vc);
    doc.text(overallAvg.toFixed(2), M + 46, y + 13);
    doc.setFontSize(8);
    doc.setTextColor(...MID);
    doc.text(
      `/ ${rubric.scale.max}   aggregate across ${responses.length} evaluator${responses.length !== 1 ? "s" : ""}  ·  N/A excluded`,
      M + 64,
      y + 13
    );
    // gauge bar
    const bx = M + 4,
      by = y + 20,
      bw = COL - 8,
      bh = 3.5;
    doc.setFillColor(...LGRAY);
    doc.roundedRect(bx, by, bw, bh, 1, 1, "F");
    const fw = Math.max(4, overallRatio * bw);
    const gaugeCol: [number, number, number] = overallRatio < 0.5 ? [59, 130, 246] : [34, 197, 94];
    doc.setFillColor(...gaugeCol);
    doc.roundedRect(bx, by, fw, bh, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(29, 78, 216);
    doc.text("Build", bx, by + 7);
    doc.setTextColor(21, 128, 61);
    doc.text("Buy", bx + bw, by + 7, { align: "right" });
    y += 34;
  }

  // Dimension breakdown
  y += 3;
  pageCheck(12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text("Dimension Breakdown", M, y);
  y += 5;
  doc.setDrawColor(...LGRAY);
  doc.setLineWidth(0.3);
  doc.line(M, y, M + COL, y);
  y += 5;

  dimAvgs.forEach((d) => {
    pageCheck(8);
    const vc = verdictColor(d.ratio);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    const nameLabel = d.name + (d.custom ? " ✦" : "");
    doc.text(nameLabel, M, y);
    const bx = M + 70,
      bw = 76,
      bh = 3.5,
      bby = y - 3.2;
    doc.setFillColor(...LGRAY);
    doc.roundedRect(bx, bby, bw, bh, 1, 1, "F");
    if (d.avg !== null && d.ratio !== null) {
      const barCol: [number, number, number] = d.ratio < 0.5 ? [59, 130, 246] : [34, 197, 94];
      doc.setFillColor(...barCol);
      doc.roundedRect(bx, bby, Math.max(3, d.ratio * bw), bh, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...vc);
      doc.text(d.avg.toFixed(1), M + 150, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...MID);
      doc.text(d.verdict, M + 158, y);
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(...LGRAY);
      doc.text("All N/A", M + 150, y);
    }
    if (d.naCount > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(...LGRAY);
      doc.text(`${d.naCount} skipped`, M + 185, y);
    }
    y += 7;
  });

  // Individual scores table
  y += 5;
  pageCheck(16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text("Individual Scores", M, y);
  y += 5;
  doc.setDrawColor(...LGRAY);
  doc.line(M, y, M + COL, y);
  y += 5;

  const dimW = Math.min(13, (COL - 52) / rubric.dimensions.length);
  doc.setFillColor(...FGRAY);
  doc.rect(M, y - 3.5, COL, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...MID);
  doc.text("EVALUATOR", M + 1, y + 0.5);
  doc.text("ROLE", M + 32, y + 0.5);
  rubric.dimensions.forEach((d, i) => {
    doc.text(
      d.name.split(" ")[0].slice(0, 5).toUpperCase(),
      M + 52 + i * dimW,
      y + 0.5,
      { maxWidth: dimW, align: "center" }
    );
  });
  doc.text("AVG", M + COL - 10, y + 0.5, { align: "right" });
  y += 8;

  responses.forEach((r, idx) => {
    pageCheck(7);
    if (idx % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(M, y - 3.5, COL, 6.5, "F");
    }
    const rated = rubric.dimensions
      .map((d) => r.scores[d.id])
      .filter((v): v is number => v !== undefined && v !== "na");
    const avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : null;
    const ratio =
      avg !== null ? (avg - rubric.scale.min) / (rubric.scale.max - rubric.scale.min) : null;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    doc.text(r.evaluatorName.slice(0, 18), M + 1, y);
    doc.setFontSize(7);
    doc.setTextColor(...MID);
    doc.text((r.role || "").slice(0, 12), M + 32, y);

    rubric.dimensions.forEach((d, i) => {
      const s = r.scores[d.id];
      const isNA = s === "na" || s === undefined;
      doc.setFont("helvetica", isNA ? "normal" : "bold");
      doc.setFontSize(7.5);
      const cellCol: [number, number, number] = isNA ? LGRAY : [55, 65, 81];
      doc.setTextColor(...cellCol);
      doc.text(
        isNA ? (s === "na" ? "N/A" : "—") : String(s),
        M + 52 + i * dimW,
        y,
        { align: "center", maxWidth: dimW }
      );
    });

    if (avg !== null) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...verdictColor(ratio));
      doc.text(avg.toFixed(1), M + COL - 4, y, { align: "right" });
    }
    y += 6.5;
  });

  // Comments
  const withComments = responses.filter((r) => r.comment?.trim());
  if (withComments.length > 0) {
    y += 6;
    pageCheck(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text("Evaluator Comments", M, y);
    y += 5;
    doc.setDrawColor(...LGRAY);
    doc.line(M, y, M + COL, y);
    y += 6;

    withComments.forEach((r) => {
      const rated = rubric.dimensions
        .map((d) => r.scores[d.id])
        .filter((v): v is number => v !== undefined && v !== "na");
      const avg = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : null;
      const ratio =
        avg !== null ? (avg - rubric.scale.min) / (rubric.scale.max - rubric.scale.min) : null;
      const verdict =
        ratio === null
          ? ""
          : ratio < 0.3
            ? "Strong Build"
            : ratio < 0.5
              ? "Lean Build"
              : ratio < 0.7
                ? "Lean Buy"
                : "Strong Buy";
      const commentLines = doc.splitTextToSize(r.comment, COL - 8);
      const blockH = 14 + commentLines.length * 5;
      pageCheck(blockH);

      doc.setFillColor(...FGRAY);
      doc.roundedRect(M, y - 4, COL, blockH, 2, 2, "F");
      doc.setFillColor(...AMBER);
      doc.rect(M, y - 4, 2, blockH, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...NAVY);
      doc.text(r.evaluatorName, M + 5, y + 1);
      if (r.role) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(...MID);
        doc.text(r.role, M + 5 + doc.getTextWidth(r.evaluatorName) + 3, y + 1);
      }
      if (verdict && avg !== null) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...verdictColor(ratio));
        doc.text(`${verdict}  ·  ${avg.toFixed(1)}`, M + COL - 4, y + 1, { align: "right" });
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(55, 65, 81);
      doc.text(commentLines, M + 5, y + 7);
      y += blockH + 4;
    });
  }

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...FGRAY);
    doc.rect(0, 284, W, 13, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MID);
    doc.text(
      `${rubric.title}  ·  Code: ${rubric.id}  ·  Generated ${new Date().toLocaleDateString()}`,
      M,
      290
    );
    doc.text(`Page ${p} of ${totalPages}`, W - M, 290, { align: "right" });
  }

  doc.save(`${rubric.title.replace(/[^a-z0-9]/gi, "_")}_buildbuy_${rubric.id}.pdf`);
}
