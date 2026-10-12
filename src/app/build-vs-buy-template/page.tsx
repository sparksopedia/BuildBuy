import type { Metadata } from "next";
import Link from "next/link";
import { ContentHeader, ContentCTA, ContentFooter } from "@/components/content/ContentPage";

const SITE_URL = "https://buildorbuy.app";

export const metadata: Metadata = {
  title: "Build vs. Buy Template — Free Scorecard & Checklist",
  description:
    "Free build vs. buy template with pre-built scoring dimensions, stakeholder checklist, and decision rubric. Download or use online — no signup required.",
  alternates: {
    canonical: `${SITE_URL}/build-vs-buy-template`,
  },
  openGraph: {
    title: "Build vs. Buy Template — Free Scorecard & Checklist",
    description:
      "Ready-to-use build vs. buy template. Pre-configured dimensions, scoring scales, and stakeholder checklist for product and engineering teams.",
    url: `${SITE_URL}/build-vs-buy-template`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build vs. Buy Template — Free Scorecard",
    description:
      "Free build vs. buy template with scoring dimensions, stakeholder checklist, and exportable results.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Build vs. Buy Template — Free Scorecard & Checklist",
      description:
        "Free build vs. buy template with pre-built scoring dimensions and stakeholder checklist.",
      url: `${SITE_URL}/build-vs-buy-template`,
      author: { "@type": "Organization", name: "Build or Buy" },
      publisher: { "@id": `${SITE_URL}/#organization` },
      datePublished: "2026-10-12",
      dateModified: "2026-10-12",
      mainEntityOfPage: `${SITE_URL}/build-vs-buy-template`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "HowTo",
      name: "How to Use the Build vs. Buy Template",
      description:
        "Step-by-step guide for using the build vs. buy scorecard template to evaluate technology decisions.",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Open the Template",
          text: "Go to buildorbuy.app and click 'Create a Rubric'. The template pre-populates with recommended scoring dimensions.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Customize Dimensions",
          text: "Add, remove, or rename dimensions to match your specific decision. Set weights to reflect your organization's priorities.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Invite Stakeholders",
          text: "Share the rubric code with stakeholders. Each person scores independently to prevent groupthink.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Review and Export Results",
          text: "View aggregated scores, identify areas of agreement and disagreement, and export results as PDF or CSV.",
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Build vs. Buy Template",
          item: `${SITE_URL}/build-vs-buy-template`,
        },
      ],
    },
  ],
};

const articleStyle: React.CSSProperties = {
  maxWidth: 740,
  margin: "0 auto",
  padding: "48px 20px 0",
  fontFamily: "var(--font-body)",
  color: "var(--text-primary)",
};

const h1Style: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: 36,
  fontWeight: 700,
  lineHeight: 1.2,
  marginBottom: 16,
  color: "var(--text-primary)",
};

const h2Style: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: 26,
  fontWeight: 700,
  lineHeight: 1.3,
  marginTop: 48,
  marginBottom: 14,
  color: "var(--text-primary)",
};

const h3Style: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: 20,
  fontWeight: 600,
  lineHeight: 1.35,
  marginTop: 32,
  marginBottom: 10,
  color: "var(--text-primary)",
};

const pStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.75,
  color: "var(--text-body)",
  marginBottom: 18,
};

const ulStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.75,
  color: "var(--text-body)",
  marginBottom: 18,
  paddingLeft: 24,
};

const boxStyle: React.CSSProperties = {
  background: "var(--bg-info)",
  border: "1px solid var(--bg-info-border)",
  borderRadius: 12,
  padding: "20px 24px",
  marginBottom: 24,
  marginTop: 8,
};

const tableWrapStyle: React.CSSProperties = {
  overflowX: "auto",
  marginBottom: 24,
  borderRadius: 10,
  border: "1px solid var(--border-default)",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-secondary)",
  background: "var(--table-header-bg)",
  borderBottom: "1px solid var(--border-default)",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 14,
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border-light)",
};

export default function BuildVsBuyTemplatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ContentHeader />
      <article style={articleStyle}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
          <Link href="/" style={{ color: "var(--brand-accent)", textDecoration: "none" }}>Home</Link>
          {" / "}
          Build vs. Buy Template
        </p>

        <h1 style={h1Style}>Build vs. Buy Template: Free Scorecard &amp; Decision Checklist</h1>
        <p style={{ ...pStyle, fontSize: 18, color: "var(--text-secondary)" }}>
          Skip the spreadsheet. This template gives you a pre-configured build vs. buy scorecard
          with proven evaluation dimensions, stakeholder scoring, and exportable results. Use it
          online for free or adapt it to your team&apos;s process.
        </p>

        <div style={boxStyle}>
          <p style={{ ...pStyle, marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
            Use this template online — free, instant, no signup
          </p>
          <p style={{ ...pStyle, marginBottom: 12, fontSize: 14 }}>
            <Link href="/" style={{ color: "var(--brand-accent)", fontWeight: 600 }}>Open the Build or Buy tool</Link>{" "}
            to create a rubric with these dimensions pre-loaded. Customize weights, invite
            stakeholders, and export results in under 2 minutes.
          </p>
        </div>

        <h2 style={h2Style}>Template: Recommended Scoring Dimensions</h2>
        <p style={pStyle}>
          The following dimensions cover the most important factors in a build vs. buy decision.
          Each dimension is scored on a consistent scale (we recommend 1–10) and weighted
          according to your team&apos;s priorities.
        </p>

        <div style={tableWrapStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Dimension</th>
                <th style={thStyle}>What to Evaluate</th>
                <th style={{ ...thStyle, whiteSpace: "nowrap" }}>Default Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Strategic Differentiation</td>
                <td style={tdStyle}>Is this capability a core competitive advantage?</td>
                <td style={tdStyle}>3×</td>
              </tr>
              <tr style={{ background: "var(--table-stripe)" }}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Total Cost of Ownership</td>
                <td style={tdStyle}>3–5 year cost comparison: build (dev + maintenance) vs. buy (licenses + integration)</td>
                <td style={tdStyle}>2×</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Time to Value</td>
                <td style={tdStyle}>How quickly will each option deliver a working solution?</td>
                <td style={tdStyle}>2×</td>
              </tr>
              <tr style={{ background: "var(--table-stripe)" }}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Internal Capacity</td>
                <td style={tdStyle}>Do you have the engineers, expertise, and bandwidth?</td>
                <td style={tdStyle}>2×</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Integration Complexity</td>
                <td style={tdStyle}>How deeply must this integrate with your existing stack?</td>
                <td style={tdStyle}>1×</td>
              </tr>
              <tr style={{ background: "var(--table-stripe)" }}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Risk &amp; Compliance</td>
                <td style={tdStyle}>Regulatory, security, and data sovereignty requirements</td>
                <td style={tdStyle}>1×</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Vendor Maturity</td>
                <td style={tdStyle}>Vendor track record, stability, migration path, and lock-in risk</td>
                <td style={tdStyle}>1×</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 style={h2Style}>How to Use This Template</h2>

        <h3 style={h3Style}>Step 1: Define Your Decision</h3>
        <p style={pStyle}>
          Start with a clear problem statement. What capability are you evaluating? Who are the
          users? What does success look like? A well-defined scope prevents the evaluation from
          drifting into adjacent problems.
        </p>
        <p style={pStyle}>
          Example: &quot;We need a solution for real-time event streaming from our application to our
          data warehouse, supporting 10K events/second with at-least-once delivery.&quot;
        </p>

        <h3 style={h3Style}>Step 2: Customize the Dimensions</h3>
        <p style={pStyle}>
          The seven dimensions above work for most technology decisions, but you should tailor
          them to your context. Consider adding dimensions like:
        </p>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 6 }}><strong>Scalability</strong> — Can the solution handle 10× growth?</li>
          <li style={{ marginBottom: 6 }}><strong>Developer Experience</strong> — How easy is it for your team to work with?</li>
          <li style={{ marginBottom: 6 }}><strong>Data Ownership</strong> — Who controls the data, and can you export it?</li>
          <li style={{ marginBottom: 6 }}><strong>Support &amp; SLAs</strong> — What level of support does the vendor offer?</li>
          <li style={{ marginBottom: 6 }}><strong>Customization Depth</strong> — How much can you modify the vendor&apos;s solution?</li>
        </ul>

        <h3 style={h3Style}>Step 3: Set Weights</h3>
        <p style={pStyle}>
          Weights reflect your team&apos;s priorities. Use a simple multiplier system (1×, 2×, 3×)
          rather than percentages — it&apos;s easier for stakeholders to understand.
        </p>
        <div style={boxStyle}>
          <p style={{ ...pStyle, fontSize: 14, marginBottom: 8, fontWeight: 500, color: "var(--text-secondary)" }}>
            <strong>Weight guidance:</strong>
          </p>
          <ul style={{ ...ulStyle, fontSize: 14, marginBottom: 0 }}>
            <li><strong>3×</strong> — Critical to the decision. A low score here is a dealbreaker.</li>
            <li><strong>2×</strong> — Important but not decisive on its own.</li>
            <li><strong>1×</strong> — Worth evaluating but unlikely to change the outcome alone.</li>
          </ul>
        </div>

        <h3 style={h3Style}>Step 4: Invite Stakeholders</h3>
        <p style={pStyle}>
          A build vs. buy decision affects multiple teams. Include at minimum:
        </p>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 6 }}><strong>Product manager</strong> — Strategy, user impact, roadmap alignment</li>
          <li style={{ marginBottom: 6 }}><strong>Engineering lead</strong> — Technical feasibility, maintenance, integration</li>
          <li style={{ marginBottom: 6 }}><strong>Engineering IC</strong> — Hands-on assessment of build complexity</li>
          <li style={{ marginBottom: 6 }}><strong>Operations/DevOps</strong> — Infrastructure, reliability, on-call burden</li>
          <li style={{ marginBottom: 6 }}><strong>Finance</strong> — Budget, TCO analysis, contract terms</li>
        </ul>
        <p style={pStyle}>
          Each stakeholder should score independently to avoid anchoring bias. The Build or Buy
          tool handles this automatically — share a code, each person scores on their own, and
          results are aggregated.
        </p>

        <h3 style={h3Style}>Step 5: Review Results</h3>
        <p style={pStyle}>
          Look at three things in the aggregated results:
        </p>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 6 }}>
            <strong>Weighted total score.</strong> Does the overall score clearly favor build or buy?
          </li>
          <li style={{ marginBottom: 6 }}>
            <strong>Score distribution.</strong> Are there dimensions where stakeholders strongly
            disagree? High variance often reveals hidden assumptions.
          </li>
          <li style={{ marginBottom: 6 }}>
            <strong>Dealbreaker dimensions.</strong> A heavily weighted dimension with a low score
            may override a favorable overall score.
          </li>
        </ul>

        <h2 style={h2Style}>Build vs. Buy Checklist</h2>
        <p style={pStyle}>
          Use this checklist before finalizing your decision:
        </p>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 8 }}>Have you clearly defined the capability and its requirements?</li>
          <li style={{ marginBottom: 8 }}>Have at least 3 stakeholders from different functions scored the rubric?</li>
          <li style={{ marginBottom: 8 }}>Have you calculated TCO for both options over 3–5 years?</li>
          <li style={{ marginBottom: 8 }}>Have you evaluated at least 2 vendor solutions (if leaning &quot;buy&quot;)?</li>
          <li style={{ marginBottom: 8 }}>Have you accounted for opportunity cost of engineering time?</li>
          <li style={{ marginBottom: 8 }}>Have you identified the top risks for each option?</li>
          <li style={{ marginBottom: 8 }}>Have you documented the decision rationale for future reference?</li>
          <li style={{ marginBottom: 8 }}>Have you defined success criteria and a review timeline (e.g., 6-month check-in)?</li>
        </ul>

        <h2 style={h2Style}>Scoring Scale Options</h2>
        <p style={pStyle}>
          Different scoring scales suit different contexts. Here are the most common options
          and when to use them:
        </p>
        <div style={tableWrapStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Scale</th>
                <th style={thStyle}>Best For</th>
                <th style={thStyle}>Trade-off</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 600 }}>1–10 Numeric</td>
                <td style={tdStyle}>Detailed analysis with nuanced scoring</td>
                <td style={tdStyle}>Slower; people overthink fine distinctions</td>
              </tr>
              <tr style={{ background: "var(--table-stripe)" }}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>1–5 Numeric</td>
                <td style={tdStyle}>Quick assessments with clear gradation</td>
                <td style={tdStyle}>Good balance of speed and granularity</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 600 }}>5-Star Rating</td>
                <td style={tdStyle}>Teams familiar with review-style scoring</td>
                <td style={tdStyle}>Intuitive; may skew high (3-star feels &quot;bad&quot;)</td>
              </tr>
              <tr style={{ background: "var(--table-stripe)" }}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>Thumbs Up/Down</td>
                <td style={tdStyle}>Binary decisions or quick pulse checks</td>
                <td style={tdStyle}>Fast but loses nuance</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 600 }}>0.0–10.0 Slider</td>
                <td style={tdStyle}>Precise scoring with continuous values</td>
                <td style={tdStyle}>Maximum granularity; slower to complete</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 style={h2Style}>Example: SaaS vs. Custom Build for Internal Analytics</h2>
        <p style={pStyle}>
          Here&apos;s how a real evaluation might look for a product analytics platform:
        </p>
        <div style={tableWrapStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Dimension</th>
                <th style={thStyle}>Weight</th>
                <th style={thStyle}>Build Score</th>
                <th style={thStyle}>Buy Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Strategic Differentiation</td>
                <td style={tdStyle}>3×</td>
                <td style={tdStyle}>3</td>
                <td style={tdStyle}>3</td>
              </tr>
              <tr style={{ background: "var(--table-stripe)" }}>
                <td style={tdStyle}>Total Cost of Ownership</td>
                <td style={tdStyle}>2×</td>
                <td style={tdStyle}>4</td>
                <td style={tdStyle}>7</td>
              </tr>
              <tr>
                <td style={tdStyle}>Time to Value</td>
                <td style={tdStyle}>2×</td>
                <td style={tdStyle}>3</td>
                <td style={tdStyle}>9</td>
              </tr>
              <tr style={{ background: "var(--table-stripe)" }}>
                <td style={tdStyle}>Internal Capacity</td>
                <td style={tdStyle}>2×</td>
                <td style={tdStyle}>4</td>
                <td style={tdStyle}>8</td>
              </tr>
              <tr>
                <td style={tdStyle}>Integration Complexity</td>
                <td style={tdStyle}>1×</td>
                <td style={tdStyle}>8</td>
                <td style={tdStyle}>6</td>
              </tr>
              <tr style={{ background: "var(--table-stripe)" }}>
                <td style={tdStyle}>Risk &amp; Compliance</td>
                <td style={tdStyle}>1×</td>
                <td style={tdStyle}>7</td>
                <td style={tdStyle}>6</td>
              </tr>
              <tr>
                <td style={tdStyle}>Vendor Maturity</td>
                <td style={tdStyle}>1×</td>
                <td style={tdStyle}>N/A</td>
                <td style={tdStyle}>8</td>
              </tr>
              <tr style={{ background: "var(--table-header-bg)" }}>
                <td style={{ ...tdStyle, fontWeight: 700 }}>Weighted Total</td>
                <td style={tdStyle}></td>
                <td style={{ ...tdStyle, fontWeight: 700 }}>48</td>
                <td style={{ ...tdStyle, fontWeight: 700 }}>79</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>
          In this example, &quot;buy&quot; wins decisively. Internal analytics is rarely a competitive
          differentiator, and mature SaaS solutions offer faster deployment with lower TCO.
          The build option scores well only on integration and compliance — not enough to
          overcome the weighted advantage.
        </p>

        <h2 style={h2Style}>Related Resources</h2>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 8 }}>
            <Link href="/build-vs-buy-framework" style={{ color: "var(--brand-accent)", fontWeight: 500 }}>
              Build vs. Buy Framework Guide
            </Link>{" "}
            — Deep dive into the methodology behind this template
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/make-or-buy-decision" style={{ color: "var(--brand-accent)", fontWeight: 500 }}>
              Make or Buy Decision Guide
            </Link>{" "}
            — Procurement and operations perspective on build vs. buy
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/" style={{ color: "var(--brand-accent)", fontWeight: 500 }}>
              Build or Buy Tool
            </Link>{" "}
            — Create a free rubric and start scoring now
          </li>
        </ul>

        <ContentCTA />
      </article>
      <ContentFooter />
    </>
  );
}
