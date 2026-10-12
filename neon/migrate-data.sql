-- Migrate data from Supabase to Neon
-- Run this in the Neon SQL Editor AFTER running schema.sql

-- ── Rubrics ──────────────────────────────────────────────────────
INSERT INTO rubrics (id, org, title, description, author_name, author_key, scale, dimensions, created_at)
VALUES
  (
    'NKU22N', NULL, 'ETL TOOLS', 'ETL TOOLS', 'Jason Sparks', 'jason sparks',
    '{"max":3,"min":0,"note":"Simple 4-point","label":"0–3","buyLabel":"3","buildLabel":"0"}'::jsonb,
    '[{"id":"d1","desc":"Would owning this capability create a meaningful competitive moat?","name":"Strategic Differentiation"},{"id":"d4","desc":"Is buying likely more cost-effective than building over 3–5 years?","name":"Total Cost of Ownership"},{"id":"d7","desc":"Can we share this data externally without meaningful strategic risk?","name":"Data Sensitivity & Control"},{"id":"d14","desc":"Is this space evolving fast enough that vendor R&D outpaces what we could build?","name":"Innovation Velocity"},{"id":"d9","desc":"Would building internally create significant long-term maintenance overhead?","name":"Maintenance & Ops Burden"}]'::jsonb,
    '2026-04-04 02:22:12.203+00'
  ),
  (
    'WDZ3LY', 'Test', 'test', NULL, 'Jason Sparks', 'jason sparks',
    '{"max":1,"min":0,"note":"Thumbs up or down","type":"thumbs","label":"👍/👎","buyLabel":"👍","buildLabel":"👎"}'::jsonb,
    '[{"id":"d1","desc":"Would owning this capability create a meaningful competitive moat?","name":"Strategic Differentiation"}]'::jsonb,
    '2026-04-04 03:08:07.68+00'
  ),
  (
    '65X34P', 'H-E-B Digital. Foundations Team', 'OAuth Services',
    E'We''re trying to decide whether to sign a costly contract with an authentication provider or go with an open-source option and build it ourselves, given that our requirements are very specific and difficult for most providers to fully meet.',
    'Dan Corbin', 'dan corbin',
    '{"max":10,"min":1,"note":"Detailed 10-point","label":"1–10","buyLabel":"10","buildLabel":"1"}'::jsonb,
    '[{"id":"d2","desc":"Does this sit squarely within the team''s domain expertise and strengths?","name":"Core Competency Fit"},{"id":"d3","desc":"Is speed of delivery a critical factor for this capability?","name":"Time to Value"},{"id":"d4","desc":"Is buying likely more cost-effective than building over 3–5 years?","name":"Total Cost of Ownership"},{"id":"d6","desc":"Would a commercial solution integrate well with existing systems and data?","name":"Integration Complexity"},{"id":"d9","desc":"Would building internally create significant long-term maintenance overhead?","name":"Maintenance & Ops Burden"},{"id":"d8","desc":"Do our requirements closely match what commercial vendors offer out of the box?","name":"Customization Requirements"},{"id":"d11","desc":"Do we have available talent with the right skills to build this well?","name":"Internal Talent & Capacity"},{"id":"d12","desc":"Can we absorb the risk and potential delay if an internal build effort fails?","name":"Risk Tolerance"}]'::jsonb,
    '2026-04-04 20:51:04.232+00'
  ),
  (
    '2Y3GXR', 'ReUp Education', 'Fivetran + dbt Labs', NULL, 'Jason Sparks', 'jason sparks',
    '{"max":2,"min":0,"note":"Simple 3-point","label":"0–2","buyLabel":"2","buildLabel":"0"}'::jsonb,
    '[{"id":"d14","desc":"Is this space evolving fast enough that vendor R&D outpaces what we could build?","name":"Innovation Velocity"},{"id":"d10","desc":"Can a commercial solution reliably scale with our growth trajectory?","name":"Scalability & Reliability"},{"id":"d12","desc":"Can we absorb the risk and potential delay if an internal build effort fails?","name":"Risk Tolerance"},{"id":"d8","desc":"Do our requirements closely match what commercial vendors offer out of the box?","name":"Customization Requirements"},{"id":"d9","desc":"Would building internally create significant long-term maintenance overhead?","name":"Maintenance & Ops Burden"},{"id":"d1","desc":"Would owning this capability create a meaningful competitive moat?","name":"Strategic Differentiation"},{"id":"d3","desc":"Is speed of delivery a critical factor for this capability?","name":"Time to Value"},{"id":"d4","desc":"Is buying likely more cost-effective than building over 3–5 years?","name":"Total Cost of Ownership"},{"id":"d6","desc":"Would a commercial solution integrate well with existing systems and data?","name":"Integration Complexity"},{"id":"d13","desc":"Are compliance requirements better managed by a specialized commercial vendor?","name":"Regulatory & Compliance"}]'::jsonb,
    '2026-04-06 14:26:14.301+00'
  ),
  (
    'H8ZR72', 'ReUp Example', 'Test Evaluation', NULL, 'Jason Sparks', 'jason sparks',
    '{"max":2,"min":0,"note":"Simple 3-point","label":"0–2","buyLabel":"2","buildLabel":"0"}'::jsonb,
    '[{"id":"d5","desc":"Are there proven, stable vendors with strong track records available?","name":"Vendor Market Maturity"},{"id":"d1","desc":"Would owning this capability create a meaningful competitive moat?","name":"Strategic Differentiation"},{"id":"d7","desc":"Can we share this data externally without meaningful strategic risk?","name":"Data Sensitivity & Control"},{"id":"d9","desc":"Would building internally create significant long-term maintenance overhead?","name":"Maintenance & Ops Burden"},{"id":"d12","desc":"Can we absorb the risk and potential delay if an internal build effort fails?","name":"Risk Tolerance"},{"id":"d11","desc":"Do we have available talent with the right skills to build this well?","name":"Internal Talent & Capacity"}]'::jsonb,
    '2026-04-06 19:09:32.459+00'
  )
ON CONFLICT (id) DO NOTHING;

-- ── Responses ────────────────────────────────────────────────────
INSERT INTO responses (id, rubric_id, evaluator_name, role, scores, comment, submitted_at)
VALUES
  (
    '3f2c6dbf-6846-4c66-9b5f-2347dee532b5', 'NKU22N', 'Jason', 'Operations',
    '{"d1":0,"d4":0,"d7":0,"d9":0,"d14":0}'::jsonb, NULL,
    '2026-04-04 02:22:46.174+00'
  ),
  (
    '706b54f5-9541-487a-b3d0-73f038c0908d', 'NKU22N', 'Jason Sparks', 'Product',
    '{"d1":3,"d4":0,"d7":1,"d9":2,"d14":1}'::jsonb, NULL,
    '2026-04-04 02:23:02.372+00'
  ),
  (
    '22e001c6-f26c-4cc3-ac78-6decb8af7631', 'NKU22N', 'Test Eval', 'Product',
    '{"d1":3,"d4":3,"d7":3,"d9":3,"d14":3}'::jsonb, NULL,
    '2026-04-04 02:29:39.745+00'
  ),
  (
    '86496780-6f11-4967-854a-40d0b2408721', '2Y3GXR', 'Jason Sparks', 'Product',
    '{"d1":2,"d3":2,"d4":2,"d6":2,"d8":2,"d9":2,"d10":2,"d12":2,"d13":2,"d14":2}'::jsonb, NULL,
    '2026-04-06 14:26:56.7+00'
  ),
  (
    'de3c351b-f01a-462e-ae35-b92075f102df', 'NKU22N', 'Iphone', 'Finance',
    '{"d1":2,"d4":3,"d7":1,"d9":2,"d14":3}'::jsonb, NULL,
    '2026-04-07 02:00:03.327+00'
  )
ON CONFLICT (id) DO NOTHING;
