import type { Metadata } from "next";
import Link from "next/link";
import { ContentHeader, ContentCTA, ContentFooter } from "@/components/content/ContentPage";

const SITE_URL = "https://buildorbuy.app";

export const metadata: Metadata = {
  title: "Build vs. Buy Framework — A Complete Decision Guide for Teams",
  description:
    "Learn the structured build vs. buy framework used by top product and engineering teams. Score strategic fit, cost, risk, and speed across stakeholders to make confident technology decisions.",
  alternates: {
    canonical: `${SITE_URL}/build-vs-buy-framework`,
  },
  openGraph: {
    title: "Build vs. Buy Framework — A Complete Decision Guide",
    description:
      "A step-by-step framework for evaluating whether to build software in-house or buy a commercial solution. Used by product, engineering, and strategy teams.",
    url: `${SITE_URL}/build-vs-buy-framework`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build vs. Buy Framework — Decision Guide",
    description:
      "Step-by-step build vs. buy framework for product and engineering teams. Score dimensions, collect stakeholder input, drive confident decisions.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Build vs. Buy Framework — A Complete Decision Guide for Teams",
      description:
        "Learn the structured build vs. buy framework used by top product and engineering teams.",
      url: `${SITE_URL}/build-vs-buy-framework`,
      author: { "@type": "Organization", name: "Build or Buy" },
      publisher: { "@id": `${SITE_URL}/#organization` },
      datePublished: "2026-10-12",
      dateModified: "2026-10-12",
      mainEntityOfPage: `${SITE_URL}/build-vs-buy-framework`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "HowTo",
      name: "How to Run a Build vs. Buy Analysis",
      description:
        "A structured process for evaluating whether to build software in-house or purchase a vendor solution.",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Define the Capability",
          text: "Clearly articulate what the capability needs to do, who it serves, and what success looks like. Write a one-paragraph problem statement that all stakeholders agree on.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Identify Evaluation Dimensions",
          text: "Select 5–8 scoring dimensions such as strategic differentiation, total cost of ownership, time to value, integration complexity, internal capacity, risk and compliance, and vendor dependency.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Set Weights",
          text: "Assign relative weights to each dimension based on organizational priorities. Strategic differentiation might carry 3× weight for a core product feature but 1× for back-office tooling.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Gather Stakeholder Scores",
          text: "Invite 3–7 stakeholders from product, engineering, operations, finance, and leadership to score each dimension independently using a consistent scale.",
        },
        {
          "@type": "HowToStep",
          position: 5,
          name: "Review Aggregate Results",
          text: "Compare weighted averages across stakeholders. Look for consensus and divergence — dimensions with high disagreement often reveal hidden assumptions worth discussing.",
        },
        {
          "@type": "HowToStep",
          position: 6,
          name: "Make the Decision and Document It",
          text: "Use the aggregate scores to inform (not dictate) the decision. Document the rationale, the scores, and the key trade-offs so the decision can be revisited if circumstances change.",
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
          name: "Build vs. Buy Framework",
          item: `${SITE_URL}/build-vs-buy-framework`,
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

const olStyle: React.CSSProperties = {
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

export default function BuildVsBuyFrameworkPage() {
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
          Build vs. Buy Framework
        </p>

        <h1 style={h1Style}>Build vs. Buy Framework: A Complete Decision Guide for Product &amp; Engineering Teams</h1>
        <p style={{ ...pStyle, fontSize: 18, color: "var(--text-secondary)" }}>
          Every product and engineering organization faces the same question: should we build this
          capability in-house, or buy a commercial solution? This guide walks you through a
          structured framework that replaces gut feelings with data-driven, stakeholder-aligned
          decisions.
        </p>

        <h2 style={h2Style}>What Is a Build vs. Buy Decision?</h2>
        <p style={pStyle}>
          A build vs. buy decision is the strategic choice between developing a software capability
          internally or purchasing an existing commercial solution. It sits at the intersection of
          product strategy, engineering capacity, and business economics.
        </p>
        <p style={pStyle}>
          The decision affects far more than the immediate project. Building in-house commits
          engineering resources long-term: not just for the initial development, but for ongoing
          maintenance, feature iterations, infrastructure, security patches, and on-call support.
          Buying a vendor solution trades engineering complexity for vendor dependency, integration
          overhead, and recurring licensing costs.
        </p>
        <p style={pStyle}>
          Neither option is inherently better. The right answer depends on your organization&apos;s
          specific circumstances — and a structured framework helps you evaluate those circumstances
          objectively.
        </p>

        <h2 style={h2Style}>Why Teams Need a Build vs. Buy Framework</h2>
        <p style={pStyle}>
          Without a framework, build vs. buy discussions often devolve into opinion-driven debates.
          Engineers may default to building because they can envision the architecture. Product
          managers may favor buying because it promises faster time-to-market. Leadership may push
          for whichever option appears cheapest on a quarterly budget spreadsheet.
        </p>
        <p style={pStyle}>
          A structured framework solves this by creating a shared vocabulary and scoring system.
          When every stakeholder evaluates the same dimensions using the same scale, the
          conversation shifts from &quot;I think we should build&quot; to &quot;We scored strategic differentiation
          at 8/10 and vendor maturity at 3/10 — that favors building.&quot;
        </p>
        <div style={boxStyle}>
          <p style={{ ...pStyle, marginBottom: 0, fontWeight: 500, color: "var(--text-secondary)" }}>
            <strong>Key benefit:</strong> A build vs. buy rubric turns an emotional debate into
            a structured conversation with auditable, shareable results.
          </p>
        </div>

        <h2 style={h2Style}>The 7 Core Dimensions of a Build vs. Buy Analysis</h2>
        <p style={pStyle}>
          While every organization can customize its evaluation criteria, most build vs. buy
          frameworks share a common set of core dimensions:
        </p>

        <h3 style={h3Style}>1. Strategic Differentiation</h3>
        <p style={pStyle}>
          Is this capability a core differentiator for your product? Features that directly
          contribute to your competitive moat deserve custom development. Commoditized
          capabilities — authentication, email delivery, payment processing — rarely justify
          building from scratch.
        </p>
        <p style={pStyle}>
          Ask: &quot;If a competitor uses the same vendor solution, does it matter?&quot; If the answer
          is no, the capability is likely a commodity. If yes, it&apos;s a candidate for custom
          development.
        </p>

        <h3 style={h3Style}>2. Total Cost of Ownership (TCO)</h3>
        <p style={pStyle}>
          Building is rarely &quot;free&quot; even when you have in-house engineers. Calculate the true cost
          by including initial development time, opportunity cost of what those engineers won&apos;t
          build, ongoing maintenance (typically 15–20% of initial development cost per year),
          infrastructure, monitoring, and incident response.
        </p>
        <p style={pStyle}>
          For buying, factor in licensing fees, implementation costs, integration development,
          training, and the cost of workarounds for missing features. A 3-year TCO comparison
          is the minimum; 5-year projections are better for strategic capabilities.
        </p>

        <h3 style={h3Style}>3. Time to Value</h3>
        <p style={pStyle}>
          How quickly does your organization need this capability? If a vendor solution can be
          operational in weeks while building takes months, the opportunity cost of delayed
          delivery may outweigh any other factor. Conversely, if vendor evaluation and
          procurement take 3+ months, the speed advantage narrows.
        </p>

        <h3 style={h3Style}>4. Internal Capacity &amp; Expertise</h3>
        <p style={pStyle}>
          Do you have the right engineers available? Building a real-time data pipeline is
          straightforward if you have streaming infrastructure expertise. Without it, you&apos;re
          not just building a feature — you&apos;re building a team competency.
        </p>
        <p style={pStyle}>
          Also consider the maintenance burden. Even if you can build version 1, do you have
          the capacity to maintain, iterate, and support it alongside your core product roadmap?
        </p>

        <h3 style={h3Style}>5. Integration Complexity</h3>
        <p style={pStyle}>
          How deeply does this capability need to integrate with your existing systems? Deep
          integrations (shared databases, real-time event streams, embedded UI components) favor
          building. Loosely coupled integrations (REST APIs, webhooks, data syncs) make vendor
          solutions more viable.
        </p>

        <h3 style={h3Style}>6. Risk &amp; Compliance</h3>
        <p style={pStyle}>
          Regulated industries (healthcare, finance, government) add compliance considerations.
          Does the vendor meet your regulatory requirements? Can you audit their data handling?
          Building in-house gives full control but also full responsibility for compliance.
        </p>

        <h3 style={h3Style}>7. Vendor Maturity &amp; Lock-in</h3>
        <p style={pStyle}>
          Evaluate the vendor&apos;s track record, financial stability, and the cost of switching
          later. A well-established vendor with standard data export formats presents low lock-in
          risk. A startup with proprietary data formats and no migration tools is a different
          calculation entirely.
        </p>

        <h2 style={h2Style}>How to Run a Build vs. Buy Analysis: Step by Step</h2>
        <p style={pStyle}>
          Follow this structured process to move from question to decision:
        </p>
        <ol style={olStyle}>
          <li style={{ marginBottom: 12 }}>
            <strong>Define the capability.</strong> Write a clear problem statement that all
            stakeholders agree on. What does this capability do? Who uses it? What does success
            look like?
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Select evaluation dimensions.</strong> Choose 5–8 dimensions relevant to
            your context. Use the seven core dimensions above as a starting point and customize
            as needed.
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Set dimension weights.</strong> Not all dimensions are equally important.
            A consumer-facing feature might weight &quot;time to value&quot; heavily. An enterprise
            platform might prioritize &quot;risk &amp; compliance.&quot;
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Gather independent stakeholder scores.</strong> Have 3–7 stakeholders score
            each dimension independently using a consistent scale (e.g., 1–10). Independent
            scoring prevents groupthink and anchoring bias.
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Review aggregated results.</strong> Look at weighted averages and the spread
            of scores. High disagreement on a dimension often reveals hidden assumptions that
            need discussion.
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Decide and document.</strong> Use scores to inform the decision (not dictate
            it). Document the rationale, the scores, and the key trade-offs for future reference.
          </li>
        </ol>

        <div style={boxStyle}>
          <p style={{ ...pStyle, marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
            Try it now — free, no signup required
          </p>
          <p style={{ ...pStyle, marginBottom: 12, fontSize: 14 }}>
            Use the <Link href="/" style={{ color: "var(--brand-accent)", fontWeight: 600 }}>Build or Buy tool</Link> to
            create a rubric, define your dimensions and weights, invite stakeholders, and see
            aggregated results in under 2 minutes.
          </p>
        </div>

        <h2 style={h2Style}>Common Build vs. Buy Mistakes to Avoid</h2>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 10 }}>
            <strong>Underestimating maintenance costs.</strong> The initial build is often the
            easy part. Budget 15–20% of the original development cost annually for maintenance,
            security patches, and incremental improvements.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Ignoring opportunity cost.</strong> Every sprint spent on internal tooling
            is a sprint not spent on your core product. Quantify what you&apos;re giving up.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Overweighting sunk costs.</strong> If you&apos;ve already started building and
            the evidence now favors buying, don&apos;t let prior investment drive the decision forward.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Evaluating a vendor solution against a perfect custom build.</strong> Compare
            what you can realistically build and maintain, not what you could theoretically build
            with unlimited resources.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Making the decision in a silo.</strong> A build vs. buy decision touches
            product, engineering, operations, finance, and leadership. Multi-stakeholder input
            prevents blind spots.
          </li>
        </ul>

        <h2 style={h2Style}>When to Build: Signals That Favor Custom Development</h2>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 8 }}>The capability is a core differentiator for your product</li>
          <li style={{ marginBottom: 8 }}>You have deep domain expertise and available engineering capacity</li>
          <li style={{ marginBottom: 8 }}>Existing vendor solutions don&apos;t meet critical requirements</li>
          <li style={{ marginBottom: 8 }}>Deep integration with existing systems is required</li>
          <li style={{ marginBottom: 8 }}>Data sovereignty or compliance requirements preclude third-party solutions</li>
          <li style={{ marginBottom: 8 }}>You need full control over the roadmap and iteration speed</li>
        </ul>

        <h2 style={h2Style}>When to Buy: Signals That Favor a Vendor Solution</h2>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 8 }}>The capability is a commodity (authentication, payments, email)</li>
          <li style={{ marginBottom: 8 }}>Speed to market is the top priority</li>
          <li style={{ marginBottom: 8 }}>Your team lacks the specialized expertise to build and maintain it</li>
          <li style={{ marginBottom: 8 }}>A mature vendor solution exists with strong API integration</li>
          <li style={{ marginBottom: 8 }}>The vendor&apos;s roadmap aligns with your future needs</li>
          <li style={{ marginBottom: 8 }}>The total cost of ownership favors buying over a 3–5 year horizon</li>
        </ul>

        <h2 style={h2Style}>Build vs. Buy for Different Team Roles</h2>

        <h3 style={h3Style}>Product Managers</h3>
        <p style={pStyle}>
          Focus on time to value and strategic fit. A vendor solution that gets you to market 3
          months faster lets you validate assumptions and iterate before committing to a custom
          build. Consider whether the vendor&apos;s feature roadmap aligns with your long-term product
          vision.
        </p>

        <h3 style={h3Style}>Engineering Leaders</h3>
        <p style={pStyle}>
          Evaluate technical fit, integration complexity, and maintenance burden. Be honest about
          available capacity — building is only viable if you can sustain it alongside your core
          roadmap. Consider the skill development opportunity: does building this grow a capability
          your team needs?
        </p>

        <h3 style={h3Style}>Finance &amp; Operations</h3>
        <p style={pStyle}>
          Run the numbers on total cost of ownership over 3–5 years. Include fully loaded
          engineering costs (salary, benefits, overhead, management) for the build option.
          For vendor solutions, factor in volume pricing, contract negotiation leverage, and
          the cost of switching vendors later.
        </p>

        <h2 style={h2Style}>Related Resources</h2>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 8 }}>
            <Link href="/build-vs-buy-template" style={{ color: "var(--brand-accent)", fontWeight: 500 }}>
              Build vs. Buy Template
            </Link>{" "}
            — A ready-to-use template with pre-configured dimensions
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/make-or-buy-decision" style={{ color: "var(--brand-accent)", fontWeight: 500 }}>
              Make or Buy Decision Guide
            </Link>{" "}
            — For operations and procurement teams evaluating make vs. buy trade-offs
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/" style={{ color: "var(--brand-accent)", fontWeight: 500 }}>
              Build or Buy Tool
            </Link>{" "}
            — Create a free rubric and start scoring in under 2 minutes
          </li>
        </ul>

        <ContentCTA />
      </article>
      <ContentFooter />
    </>
  );
}
