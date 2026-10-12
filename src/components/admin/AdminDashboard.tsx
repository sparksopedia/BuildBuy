"use client";

import { useState, useEffect, useCallback } from "react";

type Tab = "overview" | "rubrics" | "responses" | "authors" | "bans" | "audit";

interface Stats {
  totalRubrics: number;
  totalResponses: number;
  totalAuthors: number;
  totalBans: number;
  recentRubrics: number;
  recentResponses: number;
}

interface RubricRow {
  id: string;
  org: string;
  title: string;
  author_name: string;
  created_at: string;
  response_count: number;
  has_password: boolean;
}

interface ResponseRow {
  id: string;
  rubric_id: string;
  rubric_title: string;
  evaluator_name: string;
  role: string;
  scores: Record<string, number | string>;
  comment: string;
  submitted_at: string;
}

interface AuthorRow {
  author_key: string;
  author_name: string;
  rubric_count: number;
  response_count: number;
  first_rubric: string;
  last_rubric: string;
}

interface BanRow {
  id: string;
  ban_type: string;
  ban_value: string;
  reason: string | null;
  created_at: string;
}

interface AuditRow {
  id: string;
  action: string;
  target_type: string;
  target_id: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "rubrics", label: "Rubrics" },
  { key: "responses", label: "Responses" },
  { key: "authors", label: "Authors" },
  { key: "bans", label: "Bans" },
  { key: "audit", label: "Audit Log" },
];

async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: "include", ...opts });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  return res.json();
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    api("/api/admin/session")
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
    setAuthed(false);
  }, []);

  if (checking) {
    return (
      <div style={styles.center}>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          Checking session…
        </p>
      </div>
    );
  }

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", fontFamily: "var(--font-body)" }}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: 0 }}>
            Build or Buy — Admin
          </h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sign Out
          </button>
        </div>
      </header>

      <nav style={styles.tabBar}>
        <div style={styles.tabBarInner}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                ...styles.tabBtn,
                ...(tab === t.key ? styles.tabBtnActive : {}),
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main style={styles.main}>
        {tab === "overview" && <OverviewPanel />}
        {tab === "rubrics" && <RubricsPanel />}
        {tab === "responses" && <ResponsesPanel />}
        {tab === "authors" && <AuthorsPanel />}
        {tab === "bans" && <BansPanel />}
        {tab === "audit" && <AuditPanel />}
      </main>
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div style={styles.center}>
      <form onSubmit={handleSubmit} style={styles.loginCard}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px", textAlign: "center" as const }}>
          Admin Login
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 24px", textAlign: "center" as const }}>
          Build or Buy Dashboard
        </p>
        <label style={styles.label}>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          autoFocus
          autoComplete="username"
        />
        <label style={styles.label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          autoComplete="current-password"
        />
        {error && <p style={{ color: "var(--error-text)", fontSize: 13, margin: "0 0 8px" }}>{error}</p>}
        <button
          type="submit"
          disabled={!username.trim() || !password.trim() || loading}
          style={styles.primaryBtn}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div style={styles.statCard}>
      <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function OverviewPanel() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api<Stats>("/api/admin/stats").then(setStats).catch(() => {});
  }, []);

  if (!stats) return <p style={{ color: "var(--text-muted)" }}>Loading…</p>;

  return (
    <>
      <div style={styles.statGrid}>
        <StatCard label="Total Rubrics" value={stats.totalRubrics} sub={`${stats.recentRubrics} in last 7 days`} />
        <StatCard label="Total Responses" value={stats.totalResponses} sub={`${stats.recentResponses} in last 7 days`} />
        <StatCard label="Unique Authors" value={stats.totalAuthors} />
        <StatCard label="Active Bans" value={stats.totalBans} />
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
          <a href="/api/admin/export?type=rubrics&format=csv" style={styles.actionBtn}>Export Rubrics (CSV)</a>
          <a href="/api/admin/export?type=responses&format=csv" style={styles.actionBtn}>Export Responses (CSV)</a>
          <a href="/api/admin/export?type=rubrics&format=json" style={styles.actionBtn}>Export Rubrics (JSON)</a>
          <a href="/api/admin/export?type=responses&format=json" style={styles.actionBtn}>Export Responses (JSON)</a>
        </div>
      </div>
    </>
  );
}

function RubricsPanel() {
  const [rows, setRows] = useState<RubricRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (s: string, o: number) => {
    setLoading(true);
    const data = await api<{ rows: RubricRow[]; total: number }>(`/api/admin/rubrics?search=${encodeURIComponent(s)}&offset=${o}`);
    setRows(data.rows);
    setTotal(data.total);
    setLoading(false);
  }, []);

  useEffect(() => { load(search, offset); }, [load, search, offset]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete rubric "${title}" and all its responses?`)) return;
    await api(`/api/admin/rubrics?id=${id}`, { method: "DELETE" });
    load(search, offset);
  };

  return (
    <div style={styles.card}>
      <div style={styles.panelHeader}>
        <h3 style={styles.cardTitle}>All Rubrics ({total})</h3>
        <input
          placeholder="Search by title, author, or code…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
          style={{ ...styles.input, maxWidth: 280, marginBottom: 0 }}
        />
      </div>
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : (
        <>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Author</th>
                  <th style={styles.th}>Responses</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={styles.td}>
                      <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{r.id}</code>
                      {r.has_password && <span title="Password protected"> 🔒</span>}
                    </td>
                    <td style={styles.td}>{r.title}</td>
                    <td style={styles.td}>{r.author_name}</td>
                    <td style={styles.td}>{r.response_count}</td>
                    <td style={styles.td}>{fmtDate(r.created_at)}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleDelete(r.id, r.title)} style={styles.dangerBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={6} style={{ ...styles.td, textAlign: "center" as const, color: "var(--text-dim)" }}>No rubrics found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination total={total} offset={offset} limit={50} onPage={setOffset} />
        </>
      )}
    </div>
  );
}

function ResponsesPanel() {
  const [rows, setRows] = useState<ResponseRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [rubricFilter, setRubricFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (o: number, rubricId: string) => {
    setLoading(true);
    const params = new URLSearchParams({ offset: String(o) });
    if (rubricId) params.set("rubric_id", rubricId);
    const data = await api<{ rows: ResponseRow[]; total: number }>(`/api/admin/responses?${params}`);
    setRows(data.rows);
    setTotal(data.total);
    setLoading(false);
  }, []);

  useEffect(() => { load(offset, rubricFilter); }, [load, offset, rubricFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this response?")) return;
    await api(`/api/admin/responses?id=${id}`, { method: "DELETE" });
    load(offset, rubricFilter);
  };

  return (
    <div style={styles.card}>
      <div style={styles.panelHeader}>
        <h3 style={styles.cardTitle}>All Responses ({total})</h3>
        <input
          placeholder="Filter by rubric code…"
          value={rubricFilter}
          onChange={(e) => { setRubricFilter(e.target.value.toUpperCase()); setOffset(0); }}
          style={{ ...styles.input, maxWidth: 200, marginBottom: 0, fontFamily: "var(--font-mono)", fontSize: 12 }}
        />
      </div>
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : (
        <>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Rubric</th>
                  <th style={styles.th}>Evaluator</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Comment</th>
                  <th style={styles.th}>Submitted</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={styles.td}>
                      <div style={{ fontSize: 13 }}>{r.rubric_title || "—"}</div>
                      <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>{r.rubric_id}</code>
                    </td>
                    <td style={styles.td}>{r.evaluator_name}</td>
                    <td style={styles.td}>{r.role || "—"}</td>
                    <td style={{ ...styles.td, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{r.comment || "—"}</td>
                    <td style={styles.td}>{fmtDate(r.submitted_at)}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleDelete(r.id)} style={styles.dangerBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={6} style={{ ...styles.td, textAlign: "center" as const, color: "var(--text-dim)" }}>No responses found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination total={total} offset={offset} limit={50} onPage={setOffset} />
        </>
      )}
    </div>
  );
}

function AuthorsPanel() {
  const [rows, setRows] = useState<AuthorRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (s: string, o: number) => {
    setLoading(true);
    const data = await api<{ rows: AuthorRow[]; total: number }>(`/api/admin/authors?search=${encodeURIComponent(s)}&offset=${o}`);
    setRows(data.rows);
    setTotal(data.total);
    setLoading(false);
  }, []);

  useEffect(() => { load(search, offset); }, [load, search, offset]);

  return (
    <div style={styles.card}>
      <div style={styles.panelHeader}>
        <h3 style={styles.cardTitle}>All Authors ({total})</h3>
        <input
          placeholder="Search authors…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
          style={{ ...styles.input, maxWidth: 240, marginBottom: 0 }}
        />
      </div>
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : (
        <>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Author</th>
                  <th style={styles.th}>Rubrics</th>
                  <th style={styles.th}>Total Responses</th>
                  <th style={styles.th}>First Active</th>
                  <th style={styles.th}>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.author_key}>
                    <td style={styles.td}>{r.author_name}</td>
                    <td style={styles.td}>{r.rubric_count}</td>
                    <td style={styles.td}>{r.response_count}</td>
                    <td style={styles.td}>{fmtDate(r.first_rubric)}</td>
                    <td style={styles.td}>{fmtDate(r.last_rubric)}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={5} style={{ ...styles.td, textAlign: "center" as const, color: "var(--text-dim)" }}>No authors found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination total={total} offset={offset} limit={50} onPage={setOffset} />
        </>
      )}
    </div>
  );
}

function BansPanel() {
  const [bans, setBans] = useState<BanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [banType, setBanType] = useState<"email" | "ip">("email");
  const [banValue, setBanValue] = useState("");
  const [banReason, setBanReason] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await api<BanRow[]>("/api/admin/bans");
    setBans(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banValue.trim()) return;
    setAdding(true);
    await api("/api/admin/bans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ban_type: banType, ban_value: banValue.trim(), reason: banReason.trim() || null }),
    });
    setBanValue("");
    setBanReason("");
    load();
    setAdding(false);
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this ban?")) return;
    await api(`/api/admin/bans?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Add Ban</h3>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" as const }}>
          <div>
            <label style={styles.label}>Type</label>
            <select
              value={banType}
              onChange={(e) => setBanType(e.target.value as "email" | "ip")}
              style={{ ...styles.input, marginBottom: 0, width: 100 }}
            >
              <option value="email">Email</option>
              <option value="ip">IP Address</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={styles.label}>Value</label>
            <input
              value={banValue}
              onChange={(e) => setBanValue(e.target.value)}
              placeholder={banType === "email" ? "user@example.com" : "192.168.1.1"}
              style={{ ...styles.input, marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={styles.label}>Reason (optional)</label>
            <input
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Reason for ban"
              style={{ ...styles.input, marginBottom: 0 }}
            />
          </div>
          <button type="submit" disabled={!banValue.trim() || adding} style={{ ...styles.primaryBtn, marginBottom: 0 }}>
            {adding ? "Adding…" : "Add Ban"}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Active Bans ({bans.length})</h3>
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading…</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Value</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bans.map((b) => (
                  <tr key={b.id}>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: b.ban_type === "ip" ? "#FEF3C7" : "#DBEAFE",
                        color: b.ban_type === "ip" ? "#92400E" : "#1E40AF",
                      }}>
                        {b.ban_type}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontFamily: "var(--font-mono)", fontSize: 12 }}>{b.ban_value}</td>
                    <td style={styles.td}>{b.reason || "—"}</td>
                    <td style={styles.td}>{fmtDate(b.created_at)}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleRemove(b.id)} style={styles.dangerBtn}>Remove</button>
                    </td>
                  </tr>
                ))}
                {bans.length === 0 && (
                  <tr><td colSpan={5} style={{ ...styles.td, textAlign: "center" as const, color: "var(--text-dim)" }}>No active bans</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function AuditPanel() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (o: number) => {
    setLoading(true);
    const data = await api<{ rows: AuditRow[]; total: number }>(`/api/admin/audit?offset=${o}`);
    setRows(data.rows);
    setTotal(data.total);
    setLoading(false);
  }, []);

  useEffect(() => { load(offset); }, [load, offset]);

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>Audit Log ({total})</h3>
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : (
        <>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>Target Type</th>
                  <th style={styles.th}>Target ID</th>
                  <th style={styles.th}>Details</th>
                  <th style={styles.th}>When</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: r.action.includes("delete") ? "#FEE2E2" : "#DBEAFE",
                        color: r.action.includes("delete") ? "#991B1B" : "#1E40AF",
                      }}>
                        {r.action}
                      </span>
                    </td>
                    <td style={styles.td}>{r.target_type || "—"}</td>
                    <td style={{ ...styles.td, fontFamily: "var(--font-mono)", fontSize: 12 }}>{r.target_id || "—"}</td>
                    <td style={{ ...styles.td, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                      {r.details ? JSON.stringify(r.details) : "—"}
                    </td>
                    <td style={styles.td}>{fmtDate(r.created_at)}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={5} style={{ ...styles.td, textAlign: "center" as const, color: "var(--text-dim)" }}>No audit entries</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination total={total} offset={offset} limit={50} onPage={setOffset} />
        </>
      )}
    </div>
  );
}

function Pagination({ total, offset, limit, onPage }: { total: number; offset: number; limit: number; onPage: (o: number) => void }) {
  if (total <= limit) return null;
  const pages = Math.ceil(total / limit);
  const current = Math.floor(offset / limit);

  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 16, flexWrap: "wrap" as const }}>
      <button
        disabled={current === 0}
        onClick={() => onPage(Math.max(0, offset - limit))}
        style={styles.pageBtn}
      >
        Prev
      </button>
      <span style={{ fontSize: 13, color: "var(--text-muted)", padding: "6px 8px" }}>
        Page {current + 1} of {pages}
      </span>
      <button
        disabled={current >= pages - 1}
        onClick={() => onPage(offset + limit)}
        style={styles.pageBtn}
      >
        Next
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "var(--bg-page)",
  },
  loginCard: {
    background: "var(--bg-card)",
    borderRadius: 12,
    padding: "32px 28px",
    maxWidth: 360,
    width: "100%",
    margin: "0 16px",
    boxShadow: "var(--shadow-card)",
    fontFamily: "var(--font-body)",
  },
  header: {
    background: "var(--brand-navy)",
    padding: "0 16px",
  },
  headerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
  },
  logoutBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "6px 16px",
    borderRadius: 6,
    fontSize: 13,
    cursor: "pointer",
  },
  tabBar: {
    background: "var(--bg-card)",
    borderBottom: "1px solid var(--border-default)",
    padding: "0 16px",
    overflowX: "auto",
  },
  tabBarInner: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    gap: 0,
  },
  tabBtn: {
    padding: "12px 16px",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text-muted)",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  tabBtnActive: {
    color: "var(--brand-navy)",
    borderBottomColor: "var(--brand-navy)",
    fontWeight: 600,
  },
  main: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px 16px",
  },
  card: {
    background: "var(--bg-card)",
    borderRadius: 12,
    padding: 24,
    boxShadow: "var(--shadow-card)",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: "0 0 16px",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    background: "var(--bg-card)",
    borderRadius: 12,
    padding: 20,
    boxShadow: "var(--shadow-card)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 13,
  },
  th: {
    textAlign: "left" as const,
    padding: "8px 12px",
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    borderBottom: "1px solid var(--border-default)",
    whiteSpace: "nowrap" as const,
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid var(--border-light)",
    color: "var(--text-secondary)",
    fontSize: 13,
  },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--border-default)",
    background: "var(--bg-input)",
    color: "var(--text-primary)",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    marginBottom: 12,
    outline: "none",
  },
  primaryBtn: {
    width: "100%",
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    background: "var(--brand-navy)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "4px 10px",
    borderRadius: 6,
    border: "1px solid var(--bg-error-border)",
    background: "var(--bg-error)",
    color: "var(--error-text)",
    fontSize: 12,
    cursor: "pointer",
  },
  actionBtn: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid var(--border-default)",
    background: "var(--bg-card)",
    color: "var(--text-secondary)",
    fontSize: 13,
    textDecoration: "none",
    cursor: "pointer",
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase" as const,
  },
  pageBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid var(--border-default)",
    background: "var(--bg-card)",
    color: "var(--text-secondary)",
    fontSize: 13,
    cursor: "pointer",
  },
};
