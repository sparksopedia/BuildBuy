import type { Metadata } from "next";
import Link from "next/link";
import { ContentHeader, ContentCTA, ContentFooter } from "@/components/content/ContentPage";

const SITE_URL = "https://buildorbuy.app";

export const metadata: Metadata = {
  title: "Make or Buy Decision — Analysis Framework for Teams",
  description:
    "Comprehensive make or buy decision guide for operations, procurement, and product teams. Learn when to make in-house vs. buy from a vendor with structured analysis.",
  alternates: {
    canonical: `${SITE_URL}/make-or-buy-decision`,
  },
  openGraph: {
    title: "Make or Buy Decision — Analysis Framework",
    description:
      "Structured make or buy decision framework for operations, procurement, and product teams. Score dimensions, collect input, drive confident decisions.",
    url: `${SITE_URL}/make-or-buy-decision`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Make or Buy Decision — Analysis Framework",
    description:
      "Structured make-or-buy analysis framework. Evaluate cost, capability, risk, and strategic fit across stakeholders.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Make or Buy Decision — Analysis Framework for Teams",
      description:
        "Comprehensive make or buy decision guide for operations, procurement, and product teams.",
      url: `${SITE_URL}/make-or-buy-decision`,
      author: { "@type": "Organization", name: "Build or Buy" },
      publisher: { "@id": `${SITE_URL}/#organization` },
      datePublished: "2026-10-12",
      dateModified: "2026-10-12",
      mainEntityOfPage: `${SITE_URL}/make-or-buy-decision`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a make or buy decision?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A make or buy decision is the choice between producing a component, capability, or service internally versus purchasing it from an external vendor. It applies to manufacturing, software development, business operations, and any scenario where organizations can either develop something in-house or outsource it.",
          },
        },
        {
          "@type": "Question",
          name: "What factors influence a make or buy decision?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Key factors include total cost of ownership, strategic importance, internal capability, quality control requirements, supply chain risk, time to delivery, intellectual property concerns, and available capacity. The weight of each factor depends on the specific context and organizational priorities.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between make or buy and build or buy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Make or buy is the broader term used across manufacturing, operations, and procurement. Build or buy typically refers specifically to software and technology decisions. The underlying framework is the same: evaluating whether to develop internally or purchase externally based on strategic, economic, and operational factors.",
          },
        },
        {
          "@type": "Question",
          name: "When should you choose to make instead of buy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Choose to make when the capability is a core differentiator, you have available capacity and expertise, quality control is critical, the total cost of making is lower over time, or intellectual property protection is essential. Making also makes sense when no vendor solution adequately meets your requirements.",
          },
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
          name: "Make or Buy Decision",
          item: `${SITE_URL}/make-or-buy-decision`,
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

export default function MakeOrBuyDecisionPage() {
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
          Make or Buy Decision
        </p>

        <h1 style={h1Style}>Make or Buy Decision: A Structured Analysis Framework</h1>
        <p style={{ ...pStyle, fontSize: 18, color: "var(--text-secondary)" }}>
          The make or buy decision — sometimes called build or buy, make vs. buy, or insource
          vs. outsource — is one of the most consequential choices an organization makes. This
          guide provides a structured framework for evaluating whether to develop a capability
          in-house or purchase it from an external provider.
        </p>

        <h2 style={h2Style}>What Is a Make or Buy Decision?</h2>
        <p style={pStyle}>
          A make or buy decision evaluates whether an organization should produce a component,
          capability, or service internally (&quot;make&quot;) or acquire it from an external supplier
          (&quot;buy&quot;). While the term originates in manufacturing — where companies literally decide
          whether to manufacture parts or purchase them — it applies equally to software
          development, business operations, professional services, and any function where
          internal and external options exist.
        </p>
        <p style={pStyle}>
          In technology, &quot;make or buy&quot; is often called &quot;build or buy.&quot; The analysis is the same:
          a structured comparison of the costs, risks, and strategic implications of each path.
          This guide uses both terms interchangeably.
        </p>

        <h2 style={h2Style}>Make or Buy vs. Build or Buy: Is There a Difference?</h2>
        <p style={pStyle}>
          The terms are functionally equivalent. &quot;Make or buy&quot; is the traditional term used in
          operations management, supply chain, and procurement literature. &quot;Build or buy&quot; is
          more common in software engineering and product management contexts.
        </p>
        <p style={pStyle}>
          The underlying framework is identical: you&apos;re evaluating whether internal development
          or external acquisition better serves your organization&apos;s strategic, economic, and
          operational needs. Whether you&apos;re deciding to manufacture a circuit board or develop
          a microservice, the decision factors — cost, capability, risk, speed, strategic value —
          are the same.
        </p>

        <h2 style={h2Style}>Key Factors in a Make or Buy Analysis</h2>

        <h3 style={h3Style}>Cost Analysis</h3>
        <p style={pStyle}>
          The most straightforward — and most commonly miscalculated — factor. For the &quot;make&quot;
          option, include direct costs (labor, materials, infrastructure), indirect costs
          (management overhead, training, quality assurance), and opportunity costs (what else
          could those resources accomplish?).
        </p>
        <p style={pStyle}>
          For the &quot;buy&quot; option, include licensing or purchase costs, implementation and
          integration expenses, ongoing fees (subscriptions, support, maintenance), and the
          cost of switching or exiting the relationship. Always compare over a 3–5 year horizon
          — short-term cost comparisons are misleading.
        </p>

        <h3 style={h3Style}>Core Competency &amp; Strategic Value</h3>
        <p style={pStyle}>
          Is this capability central to what makes your organization competitive? Core
          competencies — the things that differentiate you in the market — generally justify
          internal development. Non-core activities that are necessary but undifferentiated
          (payroll processing, email infrastructure, standard compliance reporting) are strong
          candidates for buying.
        </p>
        <div style={boxStyle}>
          <p style={{ ...pStyle, marginBottom: 0, fontWeight: 500, color: "var(--text-secondary)" }}>
            <strong>The core competency test:</strong> If your competitor uses the same vendor
            solution, would it meaningfully erode your competitive advantage? If not, the
            capability is a commodity — buy it.
          </p>
        </div>

        <h3 style={h3Style}>Quality &amp; Control</h3>
        <p style={pStyle}>
          Making in-house gives full control over quality, specifications, and iteration speed.
          If the capability requires precise alignment with your standards, frequent
          customization, or tight integration with proprietary systems, internal development
          may be necessary.
        </p>
        <p style={pStyle}>
          Conversely, a vendor that specializes in this capability may deliver higher quality
          than your team can achieve, especially if it falls outside your core expertise. A
          vendor with 500 customers has seen and solved edge cases you haven&apos;t encountered yet.
        </p>

        <h3 style={h3Style}>Capacity &amp; Expertise</h3>
        <p style={pStyle}>
          Do you have the people, skills, and bandwidth to make this well? Building requires not
          just initial development but sustained investment in maintenance, updates, and
          support. If your team is already stretched, taking on a new internal capability creates
          risk across the entire portfolio.
        </p>

        <h3 style={h3Style}>Risk Assessment</h3>
        <p style={pStyle}>
          Each option carries different risks. Making in-house risks: schedule overruns,
          capability gaps, distraction from core priorities, and the ongoing burden of
          maintenance. Buying risks: vendor lock-in, vendor instability (acquisition, shutdown),
          dependency on external roadmaps, and potential data sovereignty issues.
        </p>
        <p style={pStyle}>
          Evaluate which risks are more manageable given your organization&apos;s capabilities and
          risk tolerance.
        </p>

        <h3 style={h3Style}>Speed to Delivery</h3>
        <p style={pStyle}>
          How urgently is this capability needed? If a competitor is gaining ground and you
          need the capability in weeks rather than months, buying (if a suitable vendor exists)
          may be the only viable option. If the timeline allows for internal development and
          the other factors favor it, the speed argument becomes less decisive.
        </p>

        <h3 style={h3Style}>Supply Chain &amp; Vendor Risk</h3>
        <p style={pStyle}>
          For physical manufacturing, supply chain reliability is critical. Can the supplier
          deliver consistently at the required quality and volume? For software, evaluate the
          vendor&apos;s uptime track record, support responsiveness, and contractual SLAs.
        </p>

        <h2 style={h2Style}>The Make or Buy Decision Process</h2>
        <p style={pStyle}>
          Follow this structured process to make a defensible, well-documented decision:
        </p>
        <ol style={{ ...ulStyle, listStyleType: "decimal" }}>
          <li style={{ marginBottom: 14 }}>
            <strong>Define the scope.</strong> Clearly describe what the capability does, who
            it serves, and what &quot;good enough&quot; looks like. Avoid scope creep at this stage.
          </li>
          <li style={{ marginBottom: 14 }}>
            <strong>Identify stakeholders.</strong> Include representatives from operations,
            engineering, finance, procurement, and leadership. Each brings a different lens.
          </li>
          <li style={{ marginBottom: 14 }}>
            <strong>Gather data.</strong> Collect vendor quotes, engineering estimates,
            internal cost data, and risk assessments. Base the analysis on data, not intuition.
          </li>
          <li style={{ marginBottom: 14 }}>
            <strong>Score evaluation dimensions.</strong> Use a rubric with 5–8 weighted
            dimensions. Have stakeholders score independently to avoid groupthink. A tool
            like <Link href="/" style={{ color: "var(--brand-accent)", fontWeight: 500 }}>Build or Buy</Link> automates
            this process.
          </li>
          <li style={{ marginBottom: 14 }}>
            <strong>Analyze results.</strong> Look at weighted totals and areas of stakeholder
            disagreement. High-variance dimensions need further discussion.
          </li>
          <li style={{ marginBottom: 14 }}>
            <strong>Document and decide.</strong> Record the scores, the rationale, and the
            key trade-offs. Set a review date (typically 6–12 months) to revisit the decision
            as circumstances change.
          </li>
        </ol>

        <h2 style={h2Style}>When to Make: Signals Favoring Internal Development</h2>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 8 }}>The capability is a core competitive differentiator</li>
          <li style={{ marginBottom: 8 }}>You have excess capacity and the right expertise</li>
          <li style={{ marginBottom: 8 }}>Quality control and customization are critical requirements</li>
          <li style={{ marginBottom: 8 }}>No vendor solution adequately meets your needs</li>
          <li style={{ marginBottom: 8 }}>Intellectual property or trade secrets are involved</li>
          <li style={{ marginBottom: 8 }}>Regulatory or data sovereignty requirements restrict third-party use</li>
          <li style={{ marginBottom: 8 }}>The long-term TCO of making is clearly lower</li>
        </ul>

        <h2 style={h2Style}>When to Buy: Signals Favoring External Procurement</h2>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 8 }}>The capability is a commodity, not a differentiator</li>
          <li style={{ marginBottom: 8 }}>A mature vendor solution exists that meets your requirements</li>
          <li style={{ marginBottom: 8 }}>Speed to delivery is the top priority</li>
          <li style={{ marginBottom: 8 }}>You lack the internal expertise or capacity to make it well</li>
          <li style={{ marginBottom: 8 }}>The vendor can achieve economies of scale you cannot</li>
          <li style={{ marginBottom: 8 }}>Your team&apos;s capacity is better spent on core product work</li>
          <li style={{ marginBottom: 8 }}>The 3–5 year TCO of buying is lower</li>
        </ul>

        <h2 style={h2Style}>Make or Buy in Software: Special Considerations</h2>
        <p style={pStyle}>
          Software make-or-buy decisions have unique characteristics compared to manufacturing:
        </p>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 10 }}>
            <strong>Maintenance burden is ongoing and significant.</strong> Unlike a physical
            part that works once manufactured, software requires continuous updates for
            security patches, dependency upgrades, API changes, and evolving requirements.
            Budget 15–20% of initial development cost annually.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Integration complexity varies widely.</strong> A SaaS tool with a REST API
            is easy to integrate. A platform that touches your database schema, authentication
            system, and frontend components is a different story entirely.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Vendor lock-in is measured in data, not contracts.</strong> You can cancel
            a subscription, but migrating years of data, workflows, and team knowledge to a
            new system is expensive and disruptive.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>The &quot;buy then customize&quot; hybrid is common.</strong> Many teams buy a
            platform and build custom extensions, integrations, or workflows on top of it.
            This middle path can combine the best of both approaches — or the worst, if the
            platform&apos;s extension model is limited.
          </li>
        </ul>

        <h2 style={h2Style}>Make or Buy Analysis for Different Industries</h2>

        <h3 style={h3Style}>Technology &amp; SaaS</h3>
        <p style={pStyle}>
          Technology companies face make-or-buy decisions constantly: internal tooling, DevOps
          platforms, analytics systems, customer communication channels. The bias should lean
          toward buying for non-differentiating capabilities. Your engineers&apos; time is your most
          expensive resource — deploy it where it drives competitive advantage.
        </p>

        <h3 style={h3Style}>Manufacturing &amp; Hardware</h3>
        <p style={pStyle}>
          Traditional make-or-buy analysis originated here. Key factors include minimum order
          quantities, supplier reliability, quality consistency, lead times, and the capital
          investment required for in-house production. Vertical integration (making more
          components) is justified when it provides quality control, cost advantages at scale,
          or protection from supply chain disruptions.
        </p>

        <h3 style={h3Style}>Financial Services</h3>
        <p style={pStyle}>
          Regulatory compliance and data security heavily influence the decision. Financial
          institutions may need to make capabilities that handle sensitive data, even when
          vendor solutions exist, due to regulatory requirements around data residency,
          auditability, and vendor risk management.
        </p>

        <h3 style={h3Style}>Healthcare</h3>
        <p style={pStyle}>
          HIPAA compliance, patient safety, and clinical workflow integration dominate the
          decision. Healthcare organizations often build custom integrations on top of
          purchased platforms because off-the-shelf solutions rarely match the specificity
          of clinical workflows.
        </p>

        <h2 style={h2Style}>Common Pitfalls in Make or Buy Decisions</h2>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 10 }}>
            <strong>The &quot;not invented here&quot; syndrome.</strong> Engineering teams sometimes
            prefer building because they believe they can do it better. This may be true for
            core differentiators but is usually wrong for commodity capabilities.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Comparing ideal build vs. real vendor.</strong> Teams compare what they
            could theoretically build (perfect, unlimited resources) against a vendor&apos;s
            actual product (imperfect, real constraints). Compare realistic build outcomes
            against realistic vendor capabilities.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Ignoring the hidden costs of buying.</strong> Vendor evaluation,
            procurement, contract negotiation, integration development, training, and ongoing
            vendor management all cost time and money.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Making the decision once and never revisiting.</strong> Markets change.
            Vendors improve (or deteriorate). Your organization&apos;s capacity evolves. Set a
            review cadence for significant make-or-buy decisions.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Deciding by committee without a framework.</strong> Without structured
            scoring, the loudest voice or highest-ranking opinion wins. A rubric-based
            approach ensures every perspective is weighted appropriately.
          </li>
        </ul>

        <div style={boxStyle}>
          <p style={{ ...pStyle, marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
            Run your make or buy analysis now
          </p>
          <p style={{ ...pStyle, marginBottom: 12, fontSize: 14 }}>
            Use the <Link href="/" style={{ color: "var(--brand-accent)", fontWeight: 600 }}>Build or Buy tool</Link> to
            create a free rubric, define your evaluation dimensions, invite stakeholders, and
            get aggregated results — all in under 2 minutes, no signup required.
          </p>
        </div>

        <h2 style={h2Style}>Related Resources</h2>
        <ul style={ulStyle}>
          <li style={{ marginBottom: 8 }}>
            <Link href="/build-vs-buy-framework" style={{ color: "var(--brand-accent)", fontWeight: 500 }}>
              Build vs. Buy Framework Guide
            </Link>{" "}
            — Step-by-step framework methodology for technology decisions
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/build-vs-buy-template" style={{ color: "var(--brand-accent)", fontWeight: 500 }}>
              Build vs. Buy Template
            </Link>{" "}
            — Pre-built scorecard with recommended dimensions and weights
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
